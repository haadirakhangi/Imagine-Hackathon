import os
from flask import request, session, jsonify, send_file, Blueprint, send_from_directory
from concurrent.futures import ThreadPoolExecutor
from flask_cors import cross_origin
from werkzeug.utils import secure_filename
from langchain_community.vectorstores import FAISS
from api.serper_client import SerperProvider
from core.rag import MultiModalRAG, SimpleRAG
from server.constants import *
from server.utils import ServerUtils
from gridfs import GridFS
import json
import uuid
import re
import ast
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from bson.objectid import ObjectId
from urllib.parse import quote_plus
from werkzeug.security import check_password_hash, generate_password_hash
from dotenv import load_dotenv

load_dotenv()

company = Blueprint(name='company', import_name=__name__, url_prefix="/company")
password = quote_plus(os.getenv("MONGO_PASS"))
uri = "mongodb+srv://mongouser:" + password +"@cluster0.rcrwl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri, server_api=ServerApi('1'))

mongodb = client["IMAGINE"]
company_collection = mongodb["company"]
lessons_collection = mongodb["lessons"]
courses_collection = mongodb["course"]
train_program_collection = mongodb["train_programm"]
lab_manuals_collection = mongodb["lab_manuals"]
fs = GridFS(mongodb)

@company.route('/register', methods=['POST'])
def register():
    company_name = request.form.get('company_name')
    user_name = request.form.get('user_name')
    company_mail = request.form.get('company_mail')
    password = request.form.get('password')
    company_logo = request.files.get('company_logo')
    if company_logo and company_logo.filename.split('.')[-1].lower() in ['png', 'jpeg', 'jpg', 'svg']:
        filename = secure_filename(company_logo.filename)
        logo_id = fs.put(company_logo, filename=filename)
    else:
        return jsonify({"message": "Invalid file format. Only .png, .jpeg, and .jpg are allowed."}), 400

    if not company_name or not user_name or not company_mail or not password:
        return jsonify({"message": "Company name, User name, email, and password are required."}), 400

    if company_collection.find_one({"email": company_mail}):
        return jsonify({"message": "User already exists", "response": False}), 201

    new_company = {
        "company_name": company_name,
        "user_name": user_name,
        "email": company_mail,
        "password": generate_password_hash(password),
        "logo_id": str(logo_id)
    }

    company_collection.insert_one(new_company)
    return jsonify({"message": "Registration successful!", "response": True}), 200

@company.route('/login', methods=['POST'])
def login():
    data : dict = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"message": "Email and password are required."}), 400

    company = company_collection.find_one({"email": email})

    if company is None or not check_password_hash(company.get("password"), password):
        return jsonify({"message": "Invalid email or password."}), 401

    session['company_id'] = str(company["_id"])
    return jsonify({"message": "Login successful!", "company_id": str(company["_id"]), "response": True}), 200

@company.route('/create-course', methods=['POST'])
def create_course():
    company_id = session.get('company_id')
    if company_id is None:
        return jsonify({"message": "company not logged in", "response": False}), 401

    # try:
    course_name = request.form['required_skill']
    num_lectures = request.form['num_lectures']
    lessons = request.form['lessons']
    course_code = ServerUtils.generate_course_code(courses_collection, length=6)

    new_course = {
        "course_name": course_name,
        "num_of_lectures": num_lectures,
        "company_id": company_id,
        "lessons_data": lessons,
        "course_code": course_code,
    }

    result = courses_collection.insert_one(new_course)

    session['course_id'] = str(result.inserted_id) 
    session['lessons'] = lessons

    return jsonify({
        'message': 'Course and lessons created successfully',
        "course_name": course_name,
        "course_id": str(result.inserted_id)
    }), 200

    # except Exception as e:
    #     return jsonify({'message': 'An error occurred', 'error': str(e)}), 500
      
@company.route('/get-courses', methods=['GET'])
def get_courses():
    company_id = session.get('company_id')
    if company_id is None:
        return jsonify({"message": "company not logged in.", "response": False}), 401

    courses = list(courses_collection.find({"company_id": company_id}))
    
    courses_data = [
        {
            'id': str(course['_id']),
            'course_name': course.get('course_name'),
            'num_of_lectures': course.get('num_of_lectures'),
            'course_code': course.get('course_code'),
            'lessons_data': course.get('lessons_data'),
        }
        for course in courses
    ]
    return jsonify({"courses": courses_data, "response": True}), 200

@company.route('/fetch-lessons', methods=['POST'])
def fetch_lessons():
    company_id = session.get('company_id')
    data = request.json
    course_id = data.get('course_id')
    
    if company_id is None:
        return jsonify({"message": "company not logged in.", "response": False}), 401

    if course_id is None:
        return jsonify({"message": "Course ID not found in the request.", "response": False}), 400

    course = courses_collection.find_one({"_id": ObjectId(course_id), "company_id": company_id})

    if course is None:
        return jsonify({"message": "Course not found for this company."}), 404

    lessons_data : dict = json.loads(course.get("lessons_data", "{}"))
    lesson_statuses = []
    lesson_ids = []

    for lesson_title in lessons_data.keys():
        existing_lesson = lessons_collection.find_one({"title": lesson_title, "course_id": course_id})
        if existing_lesson:
            lesson_statuses.append("View")
            lesson_ids.append(str(existing_lesson["_id"]))
        else:
            lesson_statuses.append("Generate")
            lesson_ids.append(0)

    lab_manuals = list(lab_manuals_collection.find({"course_id": course_id}))
    manual_statuses = []
    manual_ids = []

    for manual in lab_manuals:
        manual_statuses.append("View" if manual else "Generate")
        manual_ids.append(str(manual["_id"]) if manual else 0)

    manuals = [
        {
            "id": str(lm["_id"]),
            "markdown_content": lm.get("markdown_content"),
            "exp_aim": lm.get("exp_aim"),
            "exp_number": lm.get("exp_number"),
        }
        for lm in lab_manuals
    ]

    return jsonify({
        "lessons": lessons_data,
        "lesson_statuses": lesson_statuses,
        "lesson_ids": lesson_ids,
        "lab_manuals": manuals,
        "manual_statuses": manual_statuses,
        "manual_ids": manual_ids
    }), 200

@company.route('/multimodal-rag-submodules', methods=['POST'])
async def multimodal_rag_submodules():
    company_id = session.get('company_id')
    if company_id is None:
        return jsonify({"message": "company not logged in", "response": False}), 401
    
    if 'files[]' not in request.files:
        files = []
    else:
        files = request.files.getlist('files[]')
    lesson_name = request.form['lesson_name']
    course_name = request.form['course_name']
    lesson_type = request.form.get('lesson_type', 'theoretical')
    include_images = request.form.get("includeImages", "false")
    if include_images=="true":
        include_images=True
    else:
        include_images=False
    if lesson_name=="":
        raise Exception("lesson_name must be provided")
    description = request.form['description']
    
    lesson_name = re.sub(r'[<>:"/\\|?*]', '_', lesson_name)
    current_dir = os.path.dirname(__file__)
    uploads_path = os.path.join(current_dir, 'uploaded-documents', lesson_name)
    if not os.path.exists(uploads_path):
        os.makedirs(uploads_path)
    
    for file in files:
        if file:
            filename = secure_filename(file.filename)
            file.save(os.path.join(uploads_path, filename))
    links = request.form.get('links')
    links_list = []
    if links:
        links_list = json.loads(links)
        print(f"\nLinks provided: {links_list}\n")
    search_web = request.form.get("search_web", "false")
    if search_web=="true":
        search_web=True
    else:
        search_web=False
    session['search_web'] = search_web

    if len(files)>0 and len(links_list)>0:
        session['input_type']='pdf_and_link'
        print("\nInput: File + Links...\nLinks: ",links_list)
        multimodal_rag = MultiModalRAG(
            course_name=course_name,
            lesson_name=lesson_name,
            lesson_type=lesson_type,
            documents_directory_path=uploads_path,  
            embeddings=EMBEDDINGS,
            clip_model=CLIP_MODEL,
            clip_processor=CLIP_PROCESSOR,
            clip_tokenizer=CLIP_TOKENIZER,
            input_type="pdf_and_link",
            links=links_list,
            include_images=include_images
        )
    elif len(files)>0 and search_web:
        session['input_type']='pdf_and_web'
        print("\nInput: File + Web Search...\n")
        multimodal_rag = MultiModalRAG(
            course_name=course_name,
            lesson_name=lesson_name,
            lesson_type=lesson_type,
            documents_directory_path=uploads_path,  
            embeddings=EMBEDDINGS,
            clip_model=CLIP_MODEL,
            clip_processor=CLIP_PROCESSOR,
            clip_tokenizer=CLIP_TOKENIZER,
            input_type="pdf_and_web",
            links=links_list,
            include_images=include_images
        )
    elif len(files)>0:
        session['input_type']='pdf'
        print("\nInput: File only...\n")
        multimodal_rag = MultiModalRAG(
            course_name=course_name,
            lesson_name=lesson_name,
            lesson_type=lesson_type,
            documents_directory_path=uploads_path,  
            embeddings=EMBEDDINGS,
            clip_model=CLIP_MODEL,
            clip_processor=CLIP_PROCESSOR,
            clip_tokenizer=CLIP_TOKENIZER,
            input_type="pdf",
            include_images=include_images
        )
    elif len(links_list)>0:
        session['input_type']='link'
        print("\nInput: Links only...\nLinks: ", links_list)
        multimodal_rag = MultiModalRAG(
            course_name=course_name,
            lesson_name=lesson_name,
            lesson_type=lesson_type,
            documents_directory_path=uploads_path,  
            embeddings=EMBEDDINGS,
            clip_model=CLIP_MODEL,
            clip_processor=CLIP_PROCESSOR,
            clip_tokenizer=CLIP_TOKENIZER,
            input_type="link",
            links=links_list,
            include_images=include_images
        )
    elif search_web:
        session['input_type']='web'
        print("\nInput: Web Search only...\n")
        submodules = SUB_MODULE_GENERATOR.generate_submodules_from_web(lesson_name, course_name)
        session['lesson_name'] = lesson_name
        session['course_name'] = course_name
        session['lesson_type'] = lesson_type
        session['user_profile'] = description
        session['submodules'] = submodules
        session['is_multimodal_rag']=False
        print("\nGenerated Submodules:\n", submodules)
        return jsonify({"message": "Query successful", "submodules": submodules, "response": True}), 200
    else:
        print("\nInput: None\n")
        submodules = SUB_MODULE_GENERATOR.generate_submodules(lesson_name)
        session['lesson_name'] = lesson_name
        session['course_name'] = course_name
        session['lesson_type'] = lesson_type
        session['user_profile'] = description
        session['submodules'] = submodules
        session['is_multimodal_rag'] = False
        print("\nGenerated Submodules:\n", submodules)
        return jsonify({"message": "Query successful", "submodules": submodules, "response": True}), 200

    text_vectorstore_path, image_vectorstore_path = await multimodal_rag.create_text_and_image_vectorstores()
    
    session['text_vectorstore_path'] = text_vectorstore_path
    session['image_vectorstore_path'] = image_vectorstore_path
    
    VECTORDB_TEXTBOOK = FAISS.load_local(text_vectorstore_path, EMBEDDINGS, allow_dangerous_deserialization=True)
    
    if search_web:
        submodules = await SUB_MODULE_GENERATOR.generate_submodules_from_documents_and_web(module_name=lesson_name, course_name=course_name, vectordb=VECTORDB_TEXTBOOK)
    else:
        submodules = SUB_MODULE_GENERATOR.generate_submodules_from_textbook(lesson_name, VECTORDB_TEXTBOOK)
        
    session['lesson_name'] = lesson_name
    session['course_name'] = course_name
    session['lesson_type'] = lesson_type
    session['user_profile'] = description
    session['submodules'] = submodules
    session['document_directory_path'] = uploads_path 
    session['is_multimodal_rag'] = True
    session['include_images']=include_images
    print("\nGenerated Submodules:\n", submodules)
    return jsonify({"message": "Query successful", "submodules": submodules, "response": True}), 200

@company.route('/update-submodules', methods=['POST'])
def update_submodules():
    updated_submodules = request.get_json()
    session['submodules'] = updated_submodules
    return jsonify({'message': 'Submodules updated successfully'}), 200

@company.route('/multimodal-rag-content', methods=['GET'])
async def multimodal_rag_content():
    company_id = session.get('company_id')
    if company_id is None:
        return jsonify({"message": "company not logged in", "response": False}), 401
    
    is_multimodal_rag = session.get("is_multimodal_rag")
    search_web = session.get("search_web")
    course_name = session.get("course_name")
    lesson_name = session.get("lesson_name")
    lesson_type = session.get("lesson_type")
    user_profile = session.get("user_profile")
    submodules = session.get("submodules")
    if is_multimodal_rag:
        document_paths = session.get("document_directory_path") 
        text_vectorstore_path = session.get("text_vectorstore_path")
        image_vectorstore_path = session.get("image_vectorstore_path")
        input_type = session.get('input_type')
        include_images=session.get('include_images')
        multimodal_rag = MultiModalRAG(
            course_name=course_name,
            documents_directory_path=document_paths,
            lesson_name=lesson_name,
            embeddings=EMBEDDINGS,
            clip_model=CLIP_MODEL,
            clip_processor=CLIP_PROCESSOR,
            clip_tokenizer=CLIP_TOKENIZER,
            chunk_size=1000,
            chunk_overlap=200,
            image_similarity_threshold=0.1,
            input_type=input_type,
            text_vectorstore_path=text_vectorstore_path,
            image_vectorstore_path=image_vectorstore_path,
            include_images=include_images
        )
        content_list, relevant_images_list = await multimodal_rag.execute(CONTENT_GENERATOR, TAVILY_CLIENT, lesson_name, submodules=submodules, profile=user_profile, top_k_docs=7, search_web=search_web)
        final_content = ServerUtils.json_list_to_markdown(content_list)
        return jsonify({"message": "Query successful", "relevant_images": relevant_images_list, "content": final_content, "response": True}), 200
    elif search_web:
        keys_list = list(submodules.keys())
        submodules_split_one = {key: submodules[key] for key in keys_list[:2]}
        submodules_split_two = {key: submodules[key] for key in keys_list[2:4]}
        submodules_split_three = {key: submodules[key] for key in keys_list[4:]}
        with ThreadPoolExecutor() as executor:
            future_images_list = executor.submit(SerperProvider.module_image_from_web, submodules)
            future_content_one = executor.submit(CONTENT_GENERATOR.generate_content_from_web_with_profile, submodules_split_one, lesson_name, course_name, lesson_type, user_profile, 'first')
            future_content_two = executor.submit(CONTENT_GENERATOR.generate_content_from_web_with_profile, submodules_split_two, lesson_name, course_name, lesson_type, user_profile, 'second')
            future_content_three = executor.submit(CONTENT_GENERATOR.generate_content_from_web_with_profile, submodules_split_three, lesson_name, course_name, lesson_type, user_profile, 'third')
        content_one = future_content_one.result()
        content_two = future_content_two.result()
        content_three = future_content_three.result()
        relevant_images_list = future_images_list.result()
        content_list = content_one + content_two + content_three
        final_content = ServerUtils.json_list_to_markdown(content_list)
        return jsonify({"message": "Query successful", "relevant_images": relevant_images_list, "content": final_content, "response": True}), 200
    else:
        keys_list = list(submodules.keys())
        submodules_split_one = {key: submodules[key] for key in keys_list[:2]}
        submodules_split_two = {key: submodules[key] for key in keys_list[2:4]}
        submodules_split_three = {key: submodules[key] for key in keys_list[4:]}
        with ThreadPoolExecutor() as executor:
            future_images_list = executor.submit(SerperProvider.module_image_from_web, submodules)
            future_content_one = executor.submit(CONTENT_GENERATOR.generate_content_with_profile, submodules_split_one, lesson_name, course_name, lesson_type, user_profile, 'first')
            future_content_two = executor.submit(CONTENT_GENERATOR.generate_content_with_profile, submodules_split_two, lesson_name, course_name, lesson_type, user_profile, 'second')
            future_content_three = executor.submit(CONTENT_GENERATOR.generate_content_with_profile, submodules_split_three, lesson_name, course_name, lesson_type, user_profile, 'third')
        content_one = future_content_one.result()
        content_two = future_content_two.result()
        content_three = future_content_three.result()
        relevant_images_list = future_images_list.result()
        content_list = content_one + content_two + content_three
        final_content = ServerUtils.json_list_to_markdown(content_list)
        return jsonify({"message": "Query successful", "relevant_images": relevant_images_list, "content": final_content, "response": True}), 200

@company.route('/add-lesson', methods=['POST'])
def add_lesson():
    company_id = session.get('company_id')
    if company_id is None:
        return jsonify({"message": "company not logged in.", "response": False}), 401

    data : dict = request.get_json()
    title = data.get('title')
    markdown_content = data.get('markdown_content', '')
    relevant_images = data.get('relevant_images', None)
    uploaded_images = data.get('uploaded_images', None)
    markdown_images = data.get('markdown_images',None)
    course_id = data.get('course_id')
    lesson_id = data.get('lesson_id', None)

    if not course_id:
        return jsonify({"message": "Course ID is required."}), 400

    if lesson_id:
        lesson : dict = lessons_collection.find_one({"_id": ObjectId(lesson_id)})
        if not lesson or lesson.get("company_id") != company_id:
            return jsonify({"message": "Lesson not found or you do not have permission to edit it."}), 404
        
        lessons_collection.update_one(
            {"_id": ObjectId(lesson_id)},
            {"$set": {
                "markdown_content": json.dumps(markdown_content),
                "relevant_images": json.dumps(relevant_images),
                "uploaded_images": json.dumps(uploaded_images),
                "markdown_images": json.dumps(markdown_images),
            }}
        )
    else:
        new_lesson = {
            "title": title,
            "markdown_content": json.dumps(markdown_content),
            "relevant_images": json.dumps(relevant_images),
            "uploaded_images": json.dumps(uploaded_images),
            "markdown_images": json.dumps(markdown_images),
            "company_id": company_id,
            "course_id": course_id
        }
        result = lessons_collection.insert_one(new_lesson)
        new_lesson_id = str(result.inserted_id)

    lesson_id_to_return = lesson_id if lesson_id else new_lesson_id
    return jsonify({"message": "Lesson saved successfully!", "lesson_id": lesson_id_to_return, "response": True}), 200

@company.route('/get-lesson', methods=['POST'])
def get_lesson():
    data = request.get_json()
    lesson_id = data.get('lesson_id')
    if not lesson_id:
        return jsonify({"message": "Lesson ID is required."}), 400

    lesson : dict = lessons_collection.find_one({"_id":ObjectId(lesson_id)})
    if lesson is None:
        return jsonify({"message": "Lesson not found."}), 404

    lesson_data = {
        "id": str(lesson.get("_id")),
        "title": lesson.get("title"),
        "markdown_content": lesson.get("markdown_content"),
        "relevant_images": lesson.get("relevant_images"),
        "markdown_images": lesson.get("markdown_images"),
        "uploaded_images": lesson.get("uploaded_images"),
        "company_id": lesson.get("company_id"),
        "course_id": lesson.get("course_id")
    }

    return jsonify(lesson_data), 200

@company.route('/generate-course', methods=['POST'])
async def generate_course():
    company_id = session.get('company_id')
    if company_id is None:
        return jsonify({"message": "company not logged in", "response": False}), 401

    num_lectures = request.form.get('num_lectures', None)
    course_name = request.form.get('course_name', None) 
    course_topics = request.form.get('course_topics', None)
    output = LESSON_PLANNER.generate_lesson_plan(course_name=course_name, context=course_topics, num_lectures=num_lectures)
    return jsonify({"message": "Query successful", "lessons": output, "response": True}), 200

@company.route('/generate-training-program', methods=['POST'])
@cross_origin(supports_credentials=True)
async def generate_training_program():
    company_id = session.get('company_id')
    if company_id is None:
        return jsonify({"message": "company not logged in", "response": False}), 401

    job_role : str = request.form.get('job_role')
    required_skills : dict = request.form.get('required_skills')
    scenarios : list = request.form.get('scenarios')
    company_id = session.get('company_id')
    if company_id is None:
        return jsonify({"message": "company not logged in", "response": False}), 401
    
    if 'files[]' not in request.files:
        files = []
    else:
        files = request.files.getlist('files[]')
    skill_names : list = required_skills['skill_names']
    links = required_skills.get('links')
    web_search = required_skills.get('web_search')
    pdfs = required_skills.get('pdfs')
    lesson_type = required_skills.get('lesson_type')

    return jsonify({"message": "Query successful","response": True}), 200

@company.route('/new-training-program', methods=['POST'])
@cross_origin(supports_credentials=True)
def new_training_program():
    company_id = session.get('company_id')
    if company_id is None:
        return jsonify({"message": "company not logged in", "response": False}), 401

    data : dict = request.get_json()
    job_role = data.get('jobRole')
    job_description = data.get('jobDescription')
    required_skills =  data.get('requiredSkills')

    new_train_program = {
        "job_role":job_role,
        "job_description":job_description,
        "required_skills":required_skills.split(','),
        "company_id":company_id,
        "program_code":ServerUtils.generate_program_code(train_program_collection, length=6)
    }

    result = train_program_collection.insert_one(new_train_program)
    new_train_program["_id"] = str(result.inserted_id)

    return jsonify({"message": "Trainning program successfully added", "new_train_program":new_train_program }), 200

@company.route('/get-training-program', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_training_program():
    company_id = session.get('company_id')
    if company_id is None:
        return jsonify({"message": "company not logged in.", "response": False}), 401

    train_programs = list(train_program_collection.find({"company_id": company_id}))
    
    data = [
        {
            'id': str(programs['_id']),
            'job_role': programs.get('job_role'),
            'job_description': programs.get('job_description'),
            'required_skills': programs.get('required_skills'),
            'program_code': programs.get('program_code'),
        }
        for programs in train_programs
    ]
    return jsonify({"programs": data, "response": True}), 200

@company.route('/get-program-info', methods=['GET'])
def get_program_info():
    company_id = session.get('company_id')
    if company_id is None:
        return jsonify({"message": "company not logged in.", "response": False}), 401
    program_id = request.args.get('program_id')
    
    if not program_id:
        return jsonify({
            "status": "error",
            "message": "Program ID is required."
        }), 400

    try:
        # Assuming 'programs' is the collection storing program data
        program = train_program_collection.find_one({"_id": ObjectId(program_id)})
        
        if not program:
            return jsonify({
                "status": "error",
                "message": "Program not found."
            }), 404

        # Assuming required skills are stored in the 'required_skills' field
        required_skills = program.get("required_skills", [])

        return jsonify({
            "status": "success",
            "required_skills": required_skills
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": "An error occurred while fetching program info.",
            "error": str(e)
        }), 500


@company.route('/logout', methods=['GET'])
@cross_origin(supports_credentials=True)
def logout():
    session.clear()
    return jsonify({"message": "User logged out successfully", "response":True}), 200

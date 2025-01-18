from flask import Flask
from server.config import Config
from flask_cors import CORS
def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)
    app.json.sort_keys = False
    CORS(app, supports_credentials=True)

    from server.user.routes import students
    from server.company.routes import company
    app.register_blueprint(students)
    app.register_blueprint(company)
    return app

# Imagine-Hackathon

## Team Name: Code Omega Ω<br>
## Problem Satement:
Outcome as a Service (OaaS)
Industries are shifting from SaaS to OaaS, focusing on delivering results instead of tools. Traditional software
solved part of a problem; OaaS provides complete solutions with minimal effort using AI.
Example:
Earlier, businesses used tools like Ahrefs for SEO. Now, they want an agentic blog writer that analyzes deep data,
writes insightful blogs, and compares performance to optimize keywords—delivering the outcome in one click.
Challenge:
Redefine a SaaS tool as OaaS.
  1. Identify a use case (e.g., email campaigns or video editing).
  2. Define the ideal outcome (e.g., a viral reel or optimized email).
  3. Automate workflows with AI for seamless delivery.
Product Example:
ReelGenie: A tool that generates viral reels by analyzing trends, creating scripts, and fine-tuning visuals—
delivering ready-to-post content effortlessly.
OaaS is about making outcomes easy, reliable, and impactful.

## Solution Brief:
The problem statement was open ended and allowed for flexibility when coming up with solution in different scenarios and industries. Eventually after a lot of brainstorming and gaining insights from mentors we decide to work on a B2B solution. Basically the gist of our solution was to enable organizations to generate training programs (for job roles in their company) that are tailored to their technical infrastructure, work culture, work enviornment and vision. Our solution also incorporated the user (employee or trainee) side, where they can enroll in those training programs helping them in their career goals.

## Aspire AI -  AI crafted learning—tailored for today, ready for tomorrow.
Features provided by Aspire AI:
- Automated Course Creation: AI generates structured, multimedia-rich courses in modular formats, which are highly customizable by external reference material such as pdf's, blogs, links.
- Skill Assessment: Users undergo AI-driven assessments for technical and soft skills.
- Personalization: Platform recommends tailored courses and learning paths.
- Dynamic AI Feature: Scenario-based mock interviews and job simulations for real-world readines.
- Analytical Dashboards: Impact metric visualizations and Progress tracking through an intuitive dashboard.

Outcomes provided by Aspire AI:
- End-to-End Training Solutions tailored to specific roles and skill.
- AI-powered personalized learning makes employees gain both technical and soft skills, creating a job-ready workforce.
- Automating content generation and skill assessment ensuring Time and Resource Efficiency.
- Customizable Course Formats with seamless resource integrations for contextual sources of information.

## Installation

1. Clone the repository:
```bash
git clone https://github.com/haadirakhangi/Imagine-Hackathon.git
cd Imagine-Hackathon
```

2. Set up the frontend:
```bash
cd client-side
npm install
```

3. Set up the backend:
```bash
cd ../server-side
python -m venv venv

# For Windows
venv\Scripts\activate
# For Unix or MacOS
source venv/bin/activate

pip install -r requirements.txt
```

4. Create a `.env` file in the server-side directory with your API keys:
```env
GEMINI_API_KEY=your_gemini_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
TAVILY_API_KEY=your_tavily_api_key
SERPER_API_KEY=your_serper_api_key
MONGODB_URI=your_mongodb_connection_string
SECRET_KEY=random_secret_key
```

## Running the Application
1. Start the frontend (in client-side directory):
```bash
npm run dev
```

2. Start the backend (in server-side directory):
```bash
# Make sure your virtual environment is activated
python app.py
```
The application should now be running at: http://localhost:5173

## Images:
![Aspire-AI_1](https://github.com/user-attachments/assets/ba41ea17-5448-4cd1-a8e2-16a3ada41b5a)
![Aspire-AI_2](https://github.com/user-attachments/assets/bc3e8567-e963-46ee-b4c8-753013e1b1a0)
![Aspire-AI_3](https://github.com/user-attachments/assets/63f3b6cf-0e7b-4577-b729-5696cdddcbc5)
![Aspire-AI_4](https://github.com/user-attachments/assets/b87f4f03-f9f0-4edc-9130-d6127b60966c)
![Aspire-AI_5](https://github.com/user-attachments/assets/52f25b94-bac6-420a-afa1-8dc68c4c9ab8)

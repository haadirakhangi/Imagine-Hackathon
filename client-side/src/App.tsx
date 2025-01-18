import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/Landing";
import Login from "./pages/Login";
import SoftSkillQuiz from "./pages/SoftSkillQuiz";
import MultimodalLive from "./pages/MultimodalLive";
import StudentRegister from "./pages/register/StudentRegister";
import TeacherRegister from "./pages/register/TeacherRegister";
import HardSkillQuiz from "./pages/HardSkillQuiz";
import Dashboard from "./pages/Dashboard/Dashboard";
import Interview from "./pages/Interview";
import JobRoles from "./pages/JobRoles";
// import "./pages/student/content/i18n"
import AssessmentPage from "./pages/AssessmentPage";

import TeacherDashboard from "./pages/company/TeacherDashboard";
import CourseCreate from "./pages/company/Coursecreate";
import LessonCreate from "./pages/company/Lessoncreate";
import CoursePage from "./pages/company/course/course";
import LabManual from "./pages/company/course/Lab Manual/LabManual";
import LabManualCreate from "./pages/company/course/Lab Manual/LabManualCreate";
import LessonsGrid from "./pages/company/scheduler";
import TrainingDashboard from "./pages/company/TrainingDashboard";

function App() {
  return (
    <Routes>
      <Route path="*" element={<Navigate to="/" />} />
      <Route element={<Login />} path="/login" />
      <Route element={<StudentRegister />} path="/register/student" />
      <Route element={<TeacherRegister />} path="/register/company" />
      <Route element={<HomePage />} path="/" />
      <Route element={<SoftSkillQuiz />} path="/student/soft-skill-quiz" />
      <Route element={<HardSkillQuiz />} path="/student/technical-quiz" />
      <Route element={<Interview />} path="/student/interview" />
      <Route element={<MultimodalLive />} path="/student/roleplay-exercise" />
      <Route element={<AssessmentPage />} path="/student/assessment" />
      <Route element={<Dashboard />} path="/student/dashboard" />
      <Route element={<JobRoles />} path="/student/job-roles" />
      <Route element={<TeacherDashboard />} path="/company/dashboard" />
      <Route element={<TrainingDashboard />} path="/company/training-programs" />
      <Route element={<CourseCreate />} path="/company/create-course" />
      <Route element={<LessonCreate />} path="/company/create-lesson" />
      <Route element={<CoursePage />} path="/company/course" />
      <Route element={<LabManual />} path="/company/lab-manual" />
      <Route element={<LabManualCreate />} path="/company/lab-manual-create" />
      <Route element={<LessonsGrid />} path="/company/scheduler" />

      

      
      {/* <Route element={<Home />} path="/student/home" /> */}
    </Routes>
  );
}

export default App;

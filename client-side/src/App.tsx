import "./App.css";
import CompanyRegistration from "./pages/CompanyRegistration";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { Route, Routes, Navigate } from "react-router-dom";

function App() {
  return (
    <div className="min-h-[100dvh] w-full bg-white">
      <Routes>
        <Route path="*" element={<Navigate to="/" />} />
        <Route element={<Home />} path="/" />
        <Route element={<Login />} path="/login" />
        <Route element={<CompanyRegistration />} path="/company-registration" />
      </Routes>
    </div>
  );
}

export default App;

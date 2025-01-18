import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { Route, Routes, Navigate } from "react-router-dom";

function App() {
  return (
    
    <div className="min-h-[100dvh] w-full bg-white font-play">
      <Routes>
      <Route path="*" element={<Navigate to="/" />} />
      <Route element={<Home />} path="/" />
      <Route element={<Login />} path="/login" />
      </Routes>
    </div>
  );
}

export default App;

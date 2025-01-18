import React, { useState } from "react";
import axios from 'axios';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(4, 'Password must be at least 4 characters').required('Password is required'),
});

type LoginData = {
    email: string;
    password: string;
};

const Login = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("student");

    const studentForm = useForm({ resolver: yupResolver(schema) });
    const teacherForm = useForm({ resolver: yupResolver(schema) });

    const handleCreateAccountClick = () => {
        navigate(`/register/${activeTab}`);
    };

    const handleLogin = async (data: LoginData, endpoint: string) => {
        try {
            const response = await axios.post(endpoint, data, { withCredentials: true });

            if (response.data.response) {
                alert('Login successful');
                if (activeTab === "student") {
                    sessionStorage.setItem('student_authenticated', 'true');
                    navigate('/student/assessment');
                } else {
                    sessionStorage.setItem('teacher_authenticated', 'true');
                    navigate('/teacher/dashboard');
                }
            } else {
                alert(response.data.message || 'An error occurred while logging in.');
            }
        } catch (error) {
            alert('An error occurred while logging in.');
            console.error(error);
        }
    };

    return (
        <div className="min-h-[100dvh] w-full p-4 flex justify-center items-center">
            <div className="w-full md:w-4/5 lg:w-3/5 mx-auto rounded-lg p-4 md:p-6 borderbg-white">
                <p className="text-2xl md:text-5xl font-bold text-indigo-600">
                    Log in to your account
                </p>

                <div className="relative w-full mt-4 md:mt-8 border rounded-lg">
                    <div className="relative z-10 flex">
                        <button
                            onClick={() => setActiveTab("student")}
                            className={`p-2 w-full rounded-lg font-bold ${activeTab === "student" ? "text-white bg-indigo-600" : "text-indigo-600"}`}
                        >
                            Student
                        </button>
                        <button
                            onClick={() => setActiveTab("teacher")}
                            className={`p-2 w-full rounded-lg font-bold ${activeTab === "teacher" ? "text-white bg-indigo-600" : "text-indigo-600"}`}
                        >
                            Teacher
                        </button>
                    </div>
                    <div
                        className={`absolute top-0 h-full bg-indigo-100 rounded-lg transition-all duration-200 ${
                            activeTab === "student" ? "left-0 w-1/2" : "left-1/2 w-1/2"
                        }`}
                    ></div>
                </div>

                <form
                    className="mt-4 flex flex-col gap-4"
                    onSubmit={
                        activeTab === "student"
                            ? studentForm.handleSubmit((data) => handleLogin(data, '/api/student/login'))
                            : teacherForm.handleSubmit((data) => handleLogin(data, '/api/teacher/login'))
                    }
                >
                    <div className="">
                        <p className="font-semibold">Email address</p>
                        <input
                            type="email"
                            className="p-2 rounded-lg border w-full outline-indigo-600 mt-2"
                            placeholder="Enter your email address"
                            {...(activeTab === "student" ? studentForm.register("email") : teacherForm.register("email"))}
                        />
                        <p className="text-red-500 text-sm mt-1">
                            {activeTab === "student"
                                ? studentForm.formState.errors.email?.message
                                : teacherForm.formState.errors.email?.message}
                        </p>
                    </div>

                    <div className="">
                        <p className="font-semibold">Password</p>
                        <input
                            type="password"
                            className="p-2 rounded-lg border w-full outline-indigo-600 mt-2"
                            placeholder="Enter your password"
                            {...(activeTab === "student" ? studentForm.register("password") : teacherForm.register("password"))}
                        />
                        <p className="text-red-500 text-sm mt-1">
                            {activeTab === "student"
                                ? studentForm.formState.errors.password?.message
                                : teacherForm.formState.errors.password?.message}
                        </p>
                    </div>

                    <div className="flex justify-between mt-4">
                        <div className="flex items-center gap-2">
                            <input type="checkbox" />
                            <p className="text-sm font-semibold">Remember me</p>
                        </div>
                        <button className="text-sm font-semibold">Forget your password</button>
                    </div>

                    <button
                        type="submit"
                        className="p-2 mt-4 md:mt-6 w-full rounded-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800"
                    >
                        Login
                    </button>
                </form>

                <p className="text-sm font-semibold mt-4 text-indigo-600 text-center cursor-pointer" onClick={handleCreateAccountClick}>
                    Create new account
                </p>
            </div>
        </div>
    );
};

export default Login;

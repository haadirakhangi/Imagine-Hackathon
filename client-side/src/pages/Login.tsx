import React, { useState } from "react";

const Login = () => {
  const [selected, setSelected] = useState("fd");

  return (
    <div className="min-h-[100dvh] w-full p-4 flex justify-center items-center bg-indigo-100">
      <div className="w-full md:w-4/5 lg:w-3/5 mx-auto rounded-lg p-4 md:p-6 border bg-white">
        <p className="text-2xl md:text-5xl font-bold text-indigo-600">
          Log in to your account
        </p>
        <div className="relative w-full mt-4 md:mt-8 border rounded-lg">
          <div className="relative z-10 flex">
            <button
              onClick={() => setSelected("user")}
              className="p-2 w-full rounded-lg font-bold text-indigo-600"
            >
              User
            </button>
            <button
              onClick={() => setSelected("company")}
              className="p-2 w-full rounded-lg font-bold text-indigo-600"
            >
              Company
            </button>
          </div>

          <div
            className={`absolute top-0 right-0 w-1/2 h-full bg-indigo-100 rounded-lg duration-200 transition-all ${
              selected === "user" ? "left-0" : "left-1/2"
            }`}
          ></div>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <div className="">
            <p className="font-semibold">Email address</p>
            <input
              className="p-2 rounded-lg border w-full outline-indigo-600 mt-2"
              type="email"
              placeholder="Enter your email address"
            />
          </div>

          <div className="">
            <p className="font-semibold">Password</p>
            <input
              className="p-2 rounded-lg border w-full outline-indigo-600 mt-2"
              type="email"
              placeholder="Enter your email address "
            />
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <div className="flex items-center gap-2">
            <input type="checkbox" />
            <p className="text-sm font-semibold">Remember me</p>
          </div>

          <button className="text-sm font-semibold">
            Forget your password
          </button>
        </div>

        <button className="p-2 mt-4 md:mt-6 w-full rounded-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800">
          Login
        </button>

        <p className="text-sm font-semibold mt-4 text-indigo-600 text-center">
          Create new account
        </p>
      </div>
    </div>
  );
};
export default Login;

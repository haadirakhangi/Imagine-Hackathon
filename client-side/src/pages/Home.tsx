import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import landingIcon from "../assets/landingIcon.png";

const Home = () => {
  const [showRegisterOptions, setShowRegisterOptions] = useState(false);

  return (
    <div className="min-h-[100dvh] w-full bg-white flex flex-col">
      <div className="w-full flex md:justify-between justify-center items-center px-6 p-2 border-b">
        <p className="font-bold text-xl italic">Aspire AI </p>

        <div className="hidden md:flex gap-4 bg-white ">
          <p className="rounded-lg p-2 px-3 font-semibold text-indigo-500 hover:text-indigo-600 active:text-indigo-600">
            Log In
          </p>
          <div className="relative rounded-lg ">
            <p
              className=" rounded-lg p-2 px-3 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-600 text-white font-semibold duration-200"
              onClick={() => setShowRegisterOptions(!showRegisterOptions)}
            >
              Register
            </p>
            <AnimatePresence>
              {showRegisterOptions && (
                <motion.div
                  initial={{ opacity: 0, y: -100 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -100 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-0 right-0 w-fit  rounded-b-lg border divide-y text-black font-base"
                >
                  <div className="absolute top-12 right-0 w-fit  rounded-b-lg border divide-y text-black font-base">
                    <p className="px-3 p-2 whitespace-nowrap border-t-2 border-indigo-600">
                      User Registration
                    </p>
                    <p className="px-3 p-2 whitespace-nowrap">
                      Company Registration
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div className="w-full flex-grow flex items-center">
        <div className="md:w-[80%] px-4 md:px-0 mx-auto flex flex-col md:flex-row gap-4">
          <div className="md:w-3/5 mt-6 md:mt-0 flex flex-col justify-center md:gap-6 gap-4">
            <p className="text-2xl md:text-5xl font-bold text-indigo-600">
              Level Up Your Skills, Unlock Your Future.
            </p>
            <p>
              Welcome to Solo Leveling – the ultimate AI-powered platform
              designed to help you rise from novice to expert in your chosen
              career path. Whether you're unsure of where to begin or want to
              refine what you already know, we guide you step by step. Just like
              the hero who starts from scratch and becomes unstoppable, this
              platform helps you discover your strengths, sharpen new skills,
              and unlock better opportunities. Your journey to greatness starts
              here – ARISE and level up today!
            </p>
            <p className="hidden md:inline rounded-lg w-fit p-2 px-3 mt-5 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-600 text-white font-semibold duration-200">
              Get Started
            </p>
          </div>

          <img
            src={landingIcon}
            alt="landing icon"
            className="md:w-2/5 object-scale-down"
          />

          <div className=" md:hidden bg-white mb-4">
            <p className="rounded-lg p-2 px-3 font-semibold text-indigo-500 hover:text-indigo-600 active:text-indigo-600">
              Log In
            </p>
            <p
              className="mt-4 rounded-t-lg p-2 px-3 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-600 text-white font-semibold duration-200"
              onClick={() => setShowRegisterOptions(!showRegisterOptions)}
            >
              Register
            </p>
            <div className="  rounded-b-lg border border-t-0 divide-y text-black font-base">
              <p className="px-3 p-2 whitespace-nowrap ">User Registration</p>
              <p className="px-3 p-2 whitespace-nowrap">Company Registration</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

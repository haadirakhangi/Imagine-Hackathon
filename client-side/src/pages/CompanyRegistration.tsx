const CompanyRegistration = () => {
  return (
    <div className="min-h-[100dvh] w-full p-4 flex justify-center items-center bg-indigo-100">
      <div className="w-full md:w-4/5 lg:w-3/5 mx-auto rounded-lg p-4 md:p-6 border bg-white">
        <p className="text-2xl md:text-5xl font-bold text-indigo-600">
          Company Registration
        </p>
        <div className="mt-4 md:mt-6 flex flex-col gap-4">
          <div className="">
            <p className="font-semibold">Company Name</p>
            <input
              className="p-2 rounded-lg border w-full outline-indigo-600 mt-2"
              type="email"
              placeholder="Enter company name"
            />
          </div>
          <div className="">
            <p className="font-semibold">Company Email</p>
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
              placeholder="Enter your password"
            />
          </div>
          <div className="">
            <p className="font-semibold">Username</p>
            <input
              className="p-2 rounded-lg border w-full outline-indigo-600 mt-2"
              type="email"
              placeholder="Enter your username"
            />
          </div>
          <div className="">
            <p className="font-semibold">Logo</p>
            <div className="w-full relative mt-2">
              <input
                type="file"
                className="p-1 rounded-lg border w-full opacity-0 relative z-10 "
              />
              <div className="h-full w-full bg-indigo-100 absolute top-0 left-0 rounded-lg font-semibold flex items-center justify-center">
                Chooose file
              </div>
            </div>
          </div>

          <button className=" w-full bg-indigo-600 rounded-lg font-semibold flex items-center justify-center p-2 text-white">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyRegistration;

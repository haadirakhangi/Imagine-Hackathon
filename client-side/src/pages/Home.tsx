const Home = () => {
  return (
    <div className="min-h-[100dvh] w-full bg-white">
      <div className="w-full flex justify-between items-center px-6 p-2 border-b">
        <p className="font-bold text-xl italic">Aspire AI </p>

        <div className="flex gap-4">
          <p className="rounded-lg p-2 px-3 font-semibold text-indigo-500">Sign In</p>
          <p className="rounded-lg p-2 px-3 bg-indigo-500 text-white font-semibold">Register</p>
        </div>
      </div>
    </div>
  );
};

export default Home;

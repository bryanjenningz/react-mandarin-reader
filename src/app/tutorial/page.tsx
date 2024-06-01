"use client";

import HomePage from "../page";

const TutorialPage = (): JSX.Element => {
  return (
    <>
      <HomePage />

      <div className="fixed inset-0 z-50 flex flex-col items-center justify-end gap-4 bg-black bg-opacity-80 p-4 text-center text-2xl text-white md:justify-center">
        <p className="w-full max-w-2xl text-center text-2xl">{`Welcome to the tutorial. We'll go over how to use this web app to learn Mandarin.`}</p>
        <button className="w-full max-w-2xl rounded-full bg-blue-700 px-4 py-2 text-white hover:brightness-110">
          Click to start
        </button>
      </div>
    </>
  );
};

export default TutorialPage;

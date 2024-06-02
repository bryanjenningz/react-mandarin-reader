"use client";

import { useState } from "react";
import HomePage from "../page";

type TutorialStep =
  | { type: "START" }
  | {
      type: "CLICK";
      nodeId: string;
      instructions: string;
      onClick: () => void;
    };

const TutorialPage = (): JSX.Element => {
  const [tutorialIndex, setTutorialIndex] = useState(0);
  const tutorialSteps: TutorialStep[] = [{ type: "START" }];
  const tutorialStep = tutorialSteps[tutorialIndex];

  return (
    <>
      <HomePage />

      {((): JSX.Element => {
        if (!tutorialStep) {
          return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-end gap-4 bg-black bg-opacity-80 p-4 text-center text-2xl text-white md:justify-center">
              <p className="w-full max-w-2xl text-center text-2xl">{`You finished the tutorial. Enjoy using this web app!`}</p>
              <button className="w-full max-w-2xl rounded-full bg-blue-700 px-4 py-2 text-white hover:brightness-110">
                Click to finish
              </button>
            </div>
          );
        }

        switch (tutorialStep.type) {
          case "START": {
            return (
              <div className="fixed inset-0 z-50 flex flex-col items-center justify-end gap-4 bg-black bg-opacity-80 p-4 text-center text-2xl text-white md:justify-center">
                <p className="w-full max-w-2xl text-center text-2xl">{`Welcome to the tutorial. We'll go over how to use this web app to learn Mandarin.`}</p>
                <button
                  className="w-full max-w-2xl rounded-full bg-blue-700 px-4 py-2 text-white hover:brightness-110"
                  onClick={() => setTutorialIndex(tutorialIndex + 1)}
                >
                  Click to start
                </button>
              </div>
            );
          }
          case "CLICK": {
            return <></>;
          }
        }
      })()}
    </>
  );
};

export default TutorialPage;

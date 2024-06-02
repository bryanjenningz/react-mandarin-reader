"use client";

import { useEffect, useState } from "react";
import HomePage from "../page";
import Link from "next/link";
import { clipboardPasteButtonId } from "../_components/reader-header";

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
  const tutorialSteps: TutorialStep[] = [
    { type: "START" },
    {
      type: "CLICK",
      nodeId: clipboardPasteButtonId,
      instructions:
        "Click on the clipboard paste button to paste your clipboard text into the reader.",
      onClick: () => {
        console.log("Clipboard paste button clicked");
      },
    },
  ];
  const tutorialStep = tutorialSteps[tutorialIndex];

  const [clickElement, setClickElement] = useState<Element | null>(null);
  useEffect(() => {
    if (tutorialStep?.type === "CLICK") {
      setClickElement(document.getElementById(tutorialStep.nodeId));
    }
  }, [tutorialStep]);

  return (
    <>
      <HomePage />

      {((): JSX.Element => {
        if (!tutorialStep) {
          return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-end gap-4 bg-black bg-opacity-80 p-4 text-center text-2xl text-white md:justify-center">
              <p className="w-full max-w-2xl text-center text-2xl">{`You finished the tutorial. Enjoy using this web app!`}</p>
              <Link
                href="/"
                className="w-full max-w-2xl rounded-full bg-blue-700 px-4 py-2 text-white hover:brightness-110"
              >
                Click to finish
              </Link>
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
            return (
              <div className="fixed inset-0 z-50 flex flex-col items-center justify-end gap-4 bg-gradient-to-b from-transparent to-black p-4 text-center text-2xl text-white md:justify-center">
                <p className="w-full max-w-2xl text-center text-2xl">
                  {tutorialStep.instructions}
                </p>

                {((): JSX.Element => {
                  if (!clickElement) return <></>;

                  const { left, top } = clickElement.getBoundingClientRect();

                  return (
                    <button
                      className="absolute flex h-10 w-10 animate-pulse items-center justify-center rounded-full bg-blue-600 text-sm text-white"
                      style={{
                        left,
                        top,
                      }}
                      onClick={() => {
                        tutorialStep.onClick();
                        setTutorialIndex(tutorialIndex + 1);
                      }}
                    >
                      Click
                    </button>
                  );
                })()}
              </div>
            );
          }
        }
      })()}
    </>
  );
};

export default TutorialPage;

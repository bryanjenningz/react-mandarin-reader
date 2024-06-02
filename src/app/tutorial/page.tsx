"use client";

import { useEffect, useState } from "react";
import HomePage from "../page";
import Link from "next/link";
import {
  clipboardPasteButtonId,
  openMenuButtonId,
} from "../_components/reader-header";
import { useStateStore } from "../_stores/state";
import { readerContainerId } from "../_utils/reader/constants";
import { addFlashcardButtonId } from "../_components/word-lookup";
import { lookupLongest } from "../_utils/dictionary";
import { useDictionaryStore } from "../_stores/dictionary";

type TutorialStep =
  | { type: "START" }
  | {
      type: "CLICK";
      nodeId: string;
      instructions: string;
      onClick: () => void;
    };

const tutorialSampleText =
  "這是本教程中使用的一些範例文字。此範例文字可用作展示文字閱讀器如何運作的示範。我希望您喜歡使用這個網頁應用程式。".repeat(
    10,
  );

const TutorialPage = (): JSX.Element => {
  const dispatch = useStateStore((x) => x.dispatch);
  const dictionary = useDictionaryStore((x) => x.dictionary);
  const [tutorialIndex, setTutorialIndex] = useState(0);
  const tutorialSteps: TutorialStep[] = [
    { type: "START" },
    {
      type: "CLICK",
      nodeId: clipboardPasteButtonId,
      instructions:
        "Click on the clipboard paste button to paste your clipboard text into the reader.",
      onClick: () => {
        dispatch({
          type: "PASTE_READER_TEXT",
          text: tutorialSampleText,
          date: Date.now(),
        });
      },
    },
    {
      type: "CLICK",
      nodeId: readerContainerId,
      instructions: "Click on the reader text to look up words.",
      onClick: () => {
        dispatch({
          type: "SET_READER_SELECTION",
          selection: 0,
        });
      },
    },
    {
      type: "CLICK",
      nodeId: addFlashcardButtonId,
      instructions: "Save the word as a flashcard.",
      onClick: () => {
        const entry = lookupLongest(dictionary, tutorialSampleText.slice(0, 1));
        if (!entry) return;
        dispatch({ type: "ADD_OR_REMOVE_FLASHCARD", entry });
      },
    },
    {
      type: "CLICK",
      nodeId: openMenuButtonId,
      instructions: "Click the open menu button.",
      onClick: () => {
        dispatch({ type: "OPEN_MENU" });
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
              <div className="fixed inset-0 z-50 flex flex-col items-center justify-end gap-4 bg-gradient-to-b from-transparent to-black p-4 text-center text-2xl text-white">
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

                <div className="h-5 w-full max-w-2xl overflow-hidden rounded-full bg-slate-700">
                  <div
                    className="h-5 bg-blue-700 transition-[width]"
                    style={{
                      width: `${(tutorialIndex / tutorialSteps.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            );
          }
        }
      })()}
    </>
  );
};

export default TutorialPage;

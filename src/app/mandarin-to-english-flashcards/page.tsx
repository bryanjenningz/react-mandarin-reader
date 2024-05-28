"use client";

import { useEffect, useState } from "react";
import { useStateStore } from "~/app/_stores/state";
import { SideMenu } from "~/app/_components/side-menu";
import { MandarinToEnglishFlashcardsHeader } from "./_components/mandarin-to-english-flashcards-header";
import { EmptyMessage } from "../_components/empty-message";
import { textToSpeech } from "../_utils/text-to-speech";

const MandarinToEnglishFlashcardsPage = (): JSX.Element => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isFlashcardBackShown, setIsFlashcardBackShown] = useState(false);
  const flashcards = useStateStore((state) => state.flashcards);
  const firstFlashcard = flashcards[0];

  useEffect(() => {
    if (firstFlashcard && isFlashcardBackShown) {
      textToSpeech(firstFlashcard.entry.simplified);
    }
  }, [firstFlashcard, isFlashcardBackShown]);

  return (
    <div className="flex min-h-screen flex-col items-center bg-black text-white">
      <MandarinToEnglishFlashcardsHeader
        setIsSideMenuOpen={setIsSideMenuOpen}
      />

      {((): JSX.Element => {
        if (!firstFlashcard) {
          return <EmptyMessage message="You haven't saved any flashcards." />;
        }

        return (
          <div className="flex w-full max-w-2xl grow flex-col">
            <div className="flex w-full grow flex-col items-center gap-2">
              <div className="flex gap-2 text-3xl">
                <div>{firstFlashcard.entry.traditional}</div>
                <div>{firstFlashcard.entry.simplified}</div>
              </div>

              {((): JSX.Element => {
                if (isFlashcardBackShown) {
                  return (
                    <>
                      <div className="text-lg">
                        {firstFlashcard.entry.pinyin}
                      </div>
                      <button
                        onClick={() =>
                          textToSpeech(firstFlashcard.entry.simplified)
                        }
                      >
                        Play audio
                      </button>
                      <div>{firstFlashcard.entry.meanings.join(", ")}</div>
                    </>
                  );
                }

                return <></>;
              })()}
            </div>
            <div className="flex h-12 w-full">
              {((): JSX.Element => {
                if (isFlashcardBackShown) {
                  return (
                    <>
                      <button
                        className="flex grow basis-1 items-center justify-center bg-red-900 text-lg hover:brightness-110"
                        onClick={() => setIsFlashcardBackShown(false)}
                      >
                        Fail
                      </button>
                      <button
                        className="flex grow basis-1 items-center justify-center bg-blue-900 text-lg hover:brightness-110"
                        onClick={() => setIsFlashcardBackShown(false)}
                      >
                        Pass
                      </button>
                    </>
                  );
                }

                return (
                  <button
                    className="flex grow basis-1 items-center justify-center bg-blue-900 text-lg hover:brightness-110"
                    onClick={() => setIsFlashcardBackShown(true)}
                  >
                    Show back
                  </button>
                );
              })()}
            </div>
          </div>
        );
      })()}

      <SideMenu
        selectedItem="Mandarin to English"
        isSideMenuOpen={isSideMenuOpen}
        setIsSideMenuOpen={setIsSideMenuOpen}
      />
    </div>
  );
};

export default MandarinToEnglishFlashcardsPage;

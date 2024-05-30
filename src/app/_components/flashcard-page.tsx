"use client";

import { useEffect, useState } from "react";
import { useStateStore } from "~/app/_stores/state";
import { type MenuItemName, SideMenu } from "~/app/_components/side-menu";
import { EmptyMessage } from "../_components/empty-message";
import { textToSpeech } from "../_utils/text-to-speech";
import { SimpleHeader } from "../_components/simple-header";
import { type DictionaryEntry } from "../_utils/dictionary";

export const FlashcardPage = ({
  selectedMenuItem,
  isFlashcardBackShown,
  setIsFlashcardBackShown,
  front,
  back,
}: {
  selectedMenuItem: MenuItemName;
  isFlashcardBackShown: boolean;
  setIsFlashcardBackShown: (isFlashcardBackShown: boolean) => void;
  front: (dictionaryEntry: DictionaryEntry) => JSX.Element;
  back: (dictionaryEntry: DictionaryEntry) => JSX.Element;
}): JSX.Element => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const flashcards = useStateStore((x) => x.flashcards);
  const firstFlashcard = flashcards[0];
  const playAudioOnFlashcardBackEnabled = useStateStore(
    (x) => x.settings.playAudioOnFlashcardBack.enabled,
  );
  const dispatch = useStateStore((x) => x.dispatch);

  useEffect(() => {
    if (
      firstFlashcard &&
      (!isFlashcardBackShown || playAudioOnFlashcardBackEnabled)
    ) {
      textToSpeech(firstFlashcard.entry.simplified);
    }
  }, [firstFlashcard, isFlashcardBackShown, playAudioOnFlashcardBackEnabled]);

  return (
    <div className="flex min-h-screen flex-col items-center bg-black text-white">
      <SimpleHeader
        title="Audio Flashcards"
        setIsSideMenuOpen={setIsSideMenuOpen}
      />

      {((): JSX.Element => {
        if (!firstFlashcard) {
          return <EmptyMessage message="You haven't saved any flashcards." />;
        }

        return (
          <div className="flex w-full max-w-2xl grow flex-col">
            <div className="flex w-full grow flex-col items-center gap-2">
              <section className="flex w-full flex-col items-center gap-2 p-4 text-center">
                {front(firstFlashcard.entry)}
              </section>

              {((): JSX.Element => {
                if (isFlashcardBackShown) {
                  return (
                    <section className="flex w-full flex-col items-center gap-2 p-4 text-center">
                      {back(firstFlashcard.entry)}
                    </section>
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
                        onClick={() => {
                          dispatch({ type: "FAIL_FLASHCARD" });
                          setIsFlashcardBackShown(false);
                        }}
                      >
                        Fail
                      </button>
                      <button
                        className="flex grow basis-1 items-center justify-center bg-blue-900 text-lg hover:brightness-110"
                        onClick={() => {
                          dispatch({ type: "PASS_FLASHCARD" });
                          setIsFlashcardBackShown(false);
                        }}
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
        selectedItem={selectedMenuItem}
        isSideMenuOpen={isSideMenuOpen}
        setIsSideMenuOpen={setIsSideMenuOpen}
      />
    </div>
  );
};

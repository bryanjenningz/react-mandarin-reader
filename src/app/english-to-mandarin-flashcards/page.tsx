"use client";

import { useEffect, useState } from "react";
import { useStateStore } from "~/app/_stores/state";
import { SideMenu } from "~/app/_components/side-menu";
import { EnglishToMandarinFlashcardsHeader } from "./_components/english-to-mandarin-flashcards-header";
import { EmptyMessage } from "../_components/empty-message";
import { textToSpeech } from "../_utils/text-to-speech";
import { VolumeUpIcon } from "../_icons/volume-up";

const EnglishToMandarinFlashcardsPage = (): JSX.Element => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isFlashcardBackShown, setIsFlashcardBackShown] = useState(false);
  const flashcards = useStateStore((x) => x.flashcards);
  const firstFlashcard = flashcards[0];
  const playAudioOnFlashcardBackEnabled = useStateStore(
    (x) => x.settings.playAudioOnFlashcardBack.enabled,
  );
  const dispatch = useStateStore((x) => x.dispatch);

  useEffect(() => {
    if (
      firstFlashcard &&
      isFlashcardBackShown &&
      playAudioOnFlashcardBackEnabled
    ) {
      textToSpeech(firstFlashcard.entry.simplified);
    }
  }, [firstFlashcard, isFlashcardBackShown, playAudioOnFlashcardBackEnabled]);

  return (
    <div className="flex min-h-screen flex-col items-center bg-black text-white">
      <EnglishToMandarinFlashcardsHeader
        setIsSideMenuOpen={setIsSideMenuOpen}
      />

      {((): JSX.Element => {
        if (!firstFlashcard) {
          return <EmptyMessage message="You haven't saved any flashcards." />;
        }

        return (
          <div className="flex w-full max-w-2xl grow flex-col">
            <div className="flex w-full grow flex-col items-center gap-2">
              <div>{firstFlashcard.entry.meanings.join(", ")}</div>

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
                        <VolumeUpIcon width={60} height={60} />
                        <span className="sr-only">Play audio</span>
                      </button>
                      <div>{firstFlashcard.entry.traditional}</div>
                      {firstFlashcard.entry.traditional !==
                        firstFlashcard.entry.simplified && (
                        <div>{firstFlashcard.entry.simplified}</div>
                      )}
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
        selectedItem="English to Mandarin"
        isSideMenuOpen={isSideMenuOpen}
        setIsSideMenuOpen={setIsSideMenuOpen}
      />
    </div>
  );
};

export default EnglishToMandarinFlashcardsPage;

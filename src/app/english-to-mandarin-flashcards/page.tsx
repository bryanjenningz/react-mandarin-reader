"use client";

import { useEffect, useState } from "react";
import { useStateStore } from "~/app/_stores/state";
import { textToSpeech } from "../_utils/text-to-speech";
import { VolumeUpIcon } from "../_icons/volume-up";
import { FlashcardPage } from "../_components/flashcard-page";
import { type DictionaryEntry } from "../_utils/dictionary";

const front = (entry: DictionaryEntry): JSX.Element => (
  <div>{entry.meanings.join(", ")}</div>
);

const back = (entry: DictionaryEntry): JSX.Element => (
  <>
    <div className="text-lg">{entry.pinyin}</div>
    <button onClick={() => textToSpeech(entry.simplified)}>
      <VolumeUpIcon width={60} height={60} />
      <span className="sr-only">Play audio</span>
    </button>
    <div>{entry.traditional}</div>
    {entry.traditional !== entry.simplified && <div>{entry.simplified}</div>}
  </>
);

const EnglishToMandarinFlashcardsPage = (): JSX.Element => {
  const [isFlashcardBackShown, setIsFlashcardBackShown] = useState(false);
  const firstFlashcard = useStateStore((x) => x.flashcards[0]);
  const playAudioOnFlashcardBackEnabled = useStateStore(
    (x) => x.settings.playAudioOnFlashcardBack.enabled,
  );

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
    <FlashcardPage
      selectedMenuItem="English to Mandarin"
      isFlashcardBackShown={isFlashcardBackShown}
      setIsFlashcardBackShown={setIsFlashcardBackShown}
      front={front}
      back={back}
    />
  );
};

export default EnglishToMandarinFlashcardsPage;

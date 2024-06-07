import { AddCircleIcon } from "../_icons/add-circle";
import { CancelCircleIcon } from "../_icons/cancel-circle";
import { VolumeUpIcon } from "../_icons/volume-up";
import { type Flashcard } from "../_stores/state";
import { type DictionaryEntry } from "../_utils/dictionary";
import { textToSpeech } from "../_utils/text-to-speech";

export const addFlashcardButtonId = "add-flashcard-button";

export const WordLookup = ({
  flashcards,
  dictionaryEntries,
  addOrRemoveFlashcard,
}: {
  flashcards: Flashcard[];
  dictionaryEntries: DictionaryEntry[];
  addOrRemoveFlashcard: (dictionaryEntry: DictionaryEntry) => void;
}): JSX.Element => {
  return (
    <ul className="flex max-h-[120px] w-full max-w-2xl shrink flex-col overflow-auto rounded-lg border border-white">
      {dictionaryEntries.map((dictionaryEntry) => {
        return (
          <li
            key={`${dictionaryEntry.traditional}-${dictionaryEntry.pinyin}`}
            className="border-b border-white px-2 py-2"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-2xl">
                <div>{dictionaryEntry.traditional}</div>
                {dictionaryEntry.simplified !== dictionaryEntry.traditional && (
                  <div>{dictionaryEntry.simplified}</div>
                )}
              </div>

              <button
                id={addFlashcardButtonId}
                onClick={() => addOrRemoveFlashcard(dictionaryEntry)}
              >
                {(() => {
                  const containsFlashcard = !!flashcards.find((flashcard) => {
                    return (
                      flashcard.entry.traditional ===
                        dictionaryEntry.traditional &&
                      flashcard.entry.pinyin === dictionaryEntry.pinyin
                    );
                  });
                  if (containsFlashcard) {
                    return <CancelCircleIcon width={32} height={32} />;
                  }
                  return <AddCircleIcon width={32} height={32} />;
                })()}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-lg">{dictionaryEntry.pinyin}</div>
              <button onClick={() => textToSpeech(dictionaryEntry.simplified)}>
                <VolumeUpIcon />
                <span className="sr-only">Play audio</span>
              </button>
            </div>

            <p className="text-slate-300">
              {dictionaryEntry.meanings.join(", ")}
            </p>
          </li>
        );
      })}
    </ul>
  );
};

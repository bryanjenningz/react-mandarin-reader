import { AddCircleIcon } from "../_icons/add-circle";
import { CancelCircleIcon } from "../_icons/cancel-circle";
import { VolumeUpIcon } from "../_icons/volume-up";
import { type DictionaryEntry } from "../_utils/dictionary";
import { textToSpeech } from "../_utils/text-to-speech";

export const addFlashcardButtonId = "add-flashcard-button";

export const WordLookup = ({
  containsFlashcard,
  dictionaryEntry,
  addOrRemoveFlashcard,
}: {
  containsFlashcard: boolean;
  dictionaryEntry: DictionaryEntry;
  addOrRemoveFlashcard: (dictionaryEntry: DictionaryEntry) => void;
}): JSX.Element => {
  return (
    <article className="flex w-full max-w-2xl shrink flex-col overflow-auto rounded-lg border border-white px-4 py-2">
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

      <div className="line-clamp-2 overflow-auto md:line-clamp-none">
        {dictionaryEntry.meanings.join(", ")}
      </div>
    </article>
  );
};

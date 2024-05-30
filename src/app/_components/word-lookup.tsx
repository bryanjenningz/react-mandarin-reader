import { AddCircleIcon } from "../_icons/add-circle";
import { CancelCircleIcon } from "../_icons/cancel-circle";
import { VolumeUpIcon } from "../_icons/volume-up";
import { type Dispatch } from "../_stores/state";
import { type DictionaryEntry } from "../_utils/dictionary";
import { textToSpeech } from "../_utils/text-to-speech";

export const WordLookup = ({
  containsFlashcard,
  dictionaryEntry,
  dispatch,
}: {
  containsFlashcard: boolean;
  dictionaryEntry: DictionaryEntry;
  dispatch: Dispatch;
}): JSX.Element => {
  return (
    <article className="flex w-full max-w-2xl shrink flex-col overflow-auto rounded-lg border border-white px-4 py-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xl">
          <div>{dictionaryEntry.traditional}</div>
          {dictionaryEntry.simplified !== dictionaryEntry.traditional && (
            <div>{dictionaryEntry.simplified}</div>
          )}
        </div>

        <button
          onClick={() => {
            dispatch({
              type: "ADD_OR_REMOVE_FLASHCARD",
              entry: dictionaryEntry,
            });
          }}
        >
          {(() => {
            if (containsFlashcard) {
              return <CancelCircleIcon />;
            }
            return <AddCircleIcon />;
          })()}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div>{dictionaryEntry.pinyin}</div>
        <button onClick={() => textToSpeech(dictionaryEntry.simplified)}>
          <VolumeUpIcon />
          <span className="sr-only">Play audio</span>
        </button>
      </div>

      <div className="line-clamp-3 overflow-auto text-sm md:line-clamp-none">
        {dictionaryEntry.meanings.join(", ")}
      </div>
    </article>
  );
};

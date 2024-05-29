import { useEffect, useState } from "react";
import { EmptyMessage } from "./empty-message";
import { cn } from "../_utils/class-names";
import { chunk } from "../_utils/chunk";
import { useDictionaryStore } from "../_stores/dictionary";
import { lookupLongest } from "../_utils/dictionary";
import { ArrowBackIcon } from "../_icons/arrow-back";
import { ArrowForwardIcon } from "../_icons/arrow-forward";
import { AddCircleIcon } from "../_icons/add-circle";
import { CancelCircleIcon } from "../_icons/cancel-circle";
import { useStateStore } from "../_stores/state";
import { textToSpeech } from "../_utils/text-to-speech";
import { VolumeUpIcon } from "../_icons/volume-up";

export const charsPerLine = 14;
export const linesPerPage = 13;
export const charsPerPage = charsPerLine * linesPerPage;

const readerContainerId = "reader-container";

type Dimensions = {
  width: number;
  height: number;
};

const getDimensions = (element: HTMLElement): Dimensions => {
  const { clientWidth: width, clientHeight: height } = element;
  return { width, height };
};

const getReaderContainerDimensions = (): Promise<Dimensions> => {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      if (Date.now() - start >= 10_000) return reject("No reader container");
      const readerContainer = document.getElementById(readerContainerId);
      if (readerContainer) return resolve(getDimensions(readerContainer));
      setTimeout(check, 1000);
    };
    check();
  });
};

export const ReaderText = ({
  readerText,
  readerDate,
  pageIndex,
  incrementPage,
  decrementPage,
}: {
  readerText: string;
  readerDate: number;
  pageIndex: number;
  incrementPage: () => void;
  decrementPage: () => void;
}): JSX.Element => {
  const loadDictionary = useDictionaryStore((x) => x.loadDictionary);
  const dictionary = useDictionaryStore((x) => x.dictionary);
  const flashcards = useStateStore((x) => x.flashcards);
  const dispatch = useStateStore((x) => x.dispatch);
  const [selection, setSelection] = useState<number | null>(null);
  useEffect(() => loadDictionary(), [loadDictionary]);

  const pageText = readerText.slice(
    pageIndex * charsPerPage,
    (pageIndex + 1) * charsPerPage,
  );
  const pageCount = Math.ceil(readerText.length / charsPerPage);

  const maxSelectedTextLength = 12;
  const selectedText =
    selection !== null
      ? pageText.slice(selection, selection + maxSelectedTextLength)
      : "";
  const dictionaryEntry = lookupLongest(dictionary, selectedText);
  const wordLength = dictionaryEntry?.traditional.length ?? 0;
  const containsFlashcard =
    !!dictionaryEntry &&
    !!flashcards.find(
      (card) => card.entry.traditional === dictionaryEntry.traditional,
    );
  const playAudioOnWordLookupEnabled = useStateStore(
    (x) => x.settings.playAudioOnWordLookup.enabled,
  );

  useEffect(() => {
    if (dictionaryEntry && playAudioOnWordLookupEnabled) {
      textToSpeech(dictionaryEntry.simplified);
    }
  }, [dictionaryEntry, playAudioOnWordLookupEnabled]);

  useEffect(() => {
    void (async () => {
      const dimensions = await getReaderContainerDimensions();
      console.log(dimensions);
    })();
  }, []);

  if (!readerText) {
    return <EmptyMessage message="You haven't added any text." />;
  }

  return (
    <div className="flex grow flex-col justify-between gap-2 px-2 pb-2">
      <div className="flex flex-col gap-2">
        <section
          id={readerContainerId}
          className="flex h-[70vh] w-full max-w-2xl shrink-0 flex-col text-2xl"
        >
          {chunk(pageText.split(""), charsPerLine).map((line, y) => {
            return (
              <div
                key={`${readerDate}-${y}`}
                className="flex h-8 justify-center"
              >
                {line.map((char, x) => {
                  const i = charsPerLine * y + x;
                  return (
                    <button
                      key={`${readerDate}-${y}-${x}`}
                      className={cn(
                        "flex h-8 w-6 items-center justify-center",
                        selection !== null &&
                          i >= selection &&
                          i < selection + wordLength &&
                          "bg-blue-600",
                      )}
                      onClick={() => setSelection(i)}
                    >
                      {char}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </section>

        {dictionaryEntry && (
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
        )}
      </div>

      <div className="flex shrink-0 items-center justify-between">
        <button
          className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-900 text-white transition hover:brightness-110"
          onClick={() => {
            decrementPage();
            setSelection(null);
          }}
        >
          <ArrowBackIcon />
          <span className="sr-only">Previous page</span>
        </button>
        <div className="flex grow items-center justify-center text-xl">{`${pageIndex + 1} / ${pageCount}`}</div>
        <button
          className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-900 text-white transition hover:brightness-110"
          onClick={() => {
            incrementPage();
            setSelection(null);
          }}
        >
          <ArrowForwardIcon />
          <span className="sr-only">Next page</span>
        </button>
      </div>
    </div>
  );
};

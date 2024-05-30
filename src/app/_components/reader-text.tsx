import { useEffect, useState } from "react";
import { EmptyMessage } from "./empty-message";
import { cn } from "../_utils/class-names";
import { chunk } from "../_utils/chunk";
import { useDictionaryStore } from "../_stores/dictionary";
import { lookupLongest } from "../_utils/dictionary";
import { useStateStore } from "../_stores/state";
import { textToSpeech } from "../_utils/text-to-speech";
import { WordLookup } from "./word-lookup";
import { ReaderBottomNav } from "./reader-bottom-nav";

const charSizeScalar = 1.2;
const charWidth = 24 * charSizeScalar;
const charHeight = 32 * charSizeScalar;

export const getCharsPerPage = (
  readerSize: Dimensions,
): { charsPerLine: number; linesPerPage: number; charsPerPage: number } => {
  const charsPerLine = Math.floor(readerSize.width / charWidth);
  const linesPerPage = Math.floor(readerSize.height / charHeight);
  const charsPerPage = linesPerPage * charsPerLine;
  return { charsPerLine, linesPerPage, charsPerPage };
};

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

  const readerSize = useStateStore((x) => x.readerSize);
  const { charsPerLine, charsPerPage } = getCharsPerPage(readerSize);
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
    const setReaderSize = () =>
      void (async () => {
        const { width, height } = await getReaderContainerDimensions();
        dispatch({ type: "SET_READER_SIZE", width, height });
      })();
    setReaderSize();
    addEventListener("resize", setReaderSize);
    return () => removeEventListener("resize", setReaderSize);
  }, [dispatch]);

  if (!readerText) {
    return <EmptyMessage message="You haven't added any text." />;
  }

  return (
    <div className="flex grow flex-col justify-between gap-2 px-2 pb-2">
      <div className="flex flex-col gap-2">
        <section
          id={readerContainerId}
          className="flex h-[60dvh] w-full max-w-2xl shrink-0 flex-col"
          style={{ fontSize: charWidth }}
        >
          {chunk(pageText.split(""), charsPerLine).map((line, y) => {
            return (
              <div
                key={`${readerDate}-${y}`}
                className="flex justify-center"
                style={{ height: charHeight }}
              >
                {line.map((char, x) => {
                  const i = charsPerLine * y + x;
                  return (
                    <button
                      key={`${readerDate}-${y}-${x}`}
                      className={cn(
                        "flex items-center justify-center",
                        selection !== null &&
                          i >= selection &&
                          i < selection + wordLength &&
                          "bg-blue-600",
                      )}
                      style={{ width: charWidth, height: charHeight }}
                      onPointerDown={() => setSelection(i)}
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
          <WordLookup
            containsFlashcard={containsFlashcard}
            dictionaryEntry={dictionaryEntry}
            dispatch={dispatch}
          />
        )}
      </div>

      <ReaderBottomNav
        pageIndex={pageIndex}
        pageCount={pageCount}
        onClickLeft={() => {
          decrementPage();
          setSelection(null);
        }}
        onClickRight={() => {
          incrementPage();
          setSelection(null);
        }}
      />
    </div>
  );
};

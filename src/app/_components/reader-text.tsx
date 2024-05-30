import { useEffect } from "react";
import { EmptyMessage } from "./empty-message";
import { cn } from "../_utils/class-names";
import { chunk } from "../_utils/chunk";
import { useStateStore } from "../_stores/state";

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
  const giveUpTime = 10_000;
  const retryTime = 1_000;
  return new Promise((resolve, reject) => {
    const check = (): void => {
      if (Date.now() - start >= giveUpTime) {
        return reject(
          new Error(`No reader container with id "${readerContainerId}"`),
        );
      }
      const readerContainer = document.getElementById(readerContainerId);
      if (!readerContainer) {
        return void setTimeout(check, retryTime);
      }
      return resolve(getDimensions(readerContainer));
    };
    check();
  });
};

export const ReaderText = ({
  readerText,
  readerDate,
  readerSelection,
  wordLength,
  setReaderSelection,
  pageIndex,
}: {
  readerText: string;
  readerDate: number;
  readerSelection: number | null;
  wordLength: number;
  setReaderSelection: (selection: number) => void;
  pageIndex: number;
}): JSX.Element => {
  const dispatch = useStateStore((x) => x.dispatch);
  const readerSize = useStateStore((x) => x.readerSize);
  const { charsPerLine, charsPerPage } = getCharsPerPage(readerSize);
  const pageText = readerText.slice(
    pageIndex * charsPerPage,
    (pageIndex + 1) * charsPerPage,
  );

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
                    readerSelection !== null &&
                      i >= readerSelection &&
                      i < readerSelection + wordLength &&
                      "bg-blue-600",
                  )}
                  style={{ width: charWidth, height: charHeight }}
                  onPointerDown={() => setReaderSelection(i)}
                >
                  {char}
                </button>
              );
            })}
          </div>
        );
      })}
    </section>
  );
};

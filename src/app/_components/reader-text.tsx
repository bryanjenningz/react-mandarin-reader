import { useEffect } from "react";
import { EmptyMessage } from "./empty-message";
import { cn } from "../_utils/class-names";
import { chunk } from "../_utils/chunk";
import { useStateStore } from "../_stores/state";
import {
  charWidth,
  charHeight,
  readerContainerId,
} from "../_utils/reader/constants";
import { getCharsPerPage } from "../_utils/reader/get-chars-per-page";
import { getReaderContainerBox } from "../_utils/reader/box-size";

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
        const { width, height } = await getReaderContainerBox();
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

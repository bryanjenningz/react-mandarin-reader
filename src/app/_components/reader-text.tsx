import { EmptyMessage } from "./empty-message";
import { cn } from "../_utils/class-names";
import { chunk } from "../_utils/chunk";
import { type BoxSize } from "../_stores/state";
import {
  charWidth,
  charHeight,
  readerContainerId,
} from "../_utils/reader/constants";
import { getCharsPerPage } from "../_utils/reader/get-chars-per-page";

export const ReaderText = ({
  readerSize,
  readerText,
  readerDate,
  readerSelection,
  setReaderSelection,
  pageIndex,
}: {
  readerSize: BoxSize;
  readerText: string;
  readerDate: number;
  readerSelection: { start: number; end: number } | null;
  setReaderSelection: (selection: number) => void;
  pageIndex: number;
}): JSX.Element => {
  if (!readerText) {
    return <EmptyMessage message="You haven't added any text." />;
  }

  const { charsPerLine, charsPerPage } = getCharsPerPage(readerSize);
  const pageText = readerText.slice(
    pageIndex * charsPerPage,
    (pageIndex + 1) * charsPerPage,
  );
  const readerLines = chunk(pageText.split(""), charsPerLine);

  return (
    <section
      id={readerContainerId}
      className="flex h-[60dvh] w-full max-w-2xl shrink-0 flex-col"
      style={{ fontSize: charWidth }}
    >
      {readerLines.map((line, y) => {
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
                      i >= readerSelection.start &&
                      i < readerSelection.end &&
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

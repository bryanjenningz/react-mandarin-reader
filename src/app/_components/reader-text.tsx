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

type ReaderTextProps = {
  size: BoxSize;
  text: string;
  date: number;
  selection: { start: number; end: number } | null;
  setSelection: (selection: number) => void;
  pageIndex: number;
};

export const ReaderText = ({
  size,
  text,
  date,
  selection,
  setSelection,
  pageIndex,
}: ReaderTextProps): JSX.Element => {
  if (!text) {
    return <EmptyMessage message="You haven't added any text." />;
  }

  const { charsPerLine, charsPerPage } = getCharsPerPage(size);
  const pageText = text.slice(
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
            key={`${date}-${y}`}
            className="flex justify-center"
            style={{ height: charHeight }}
          >
            {line.map((char, x) => {
              const i = charsPerLine * y + x;
              return (
                <button
                  key={`${date}-${y}-${x}`}
                  className={cn(
                    "flex items-center justify-center",
                    selection !== null &&
                      i >= selection.start &&
                      i < selection.end &&
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
  );
};

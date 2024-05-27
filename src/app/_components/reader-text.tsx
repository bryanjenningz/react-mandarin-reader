import { useState } from "react";
import { EmptyMessage } from "./empty-message";
import { cn } from "../_utils/class-names";

export const ReaderText = ({
  readerText,
  readerDate,
}: {
  readerText: string;
  readerDate: number;
}): JSX.Element => {
  const [selection, setSelection] = useState<{ x: number; y: number } | null>(
    null,
  );
  const charsPerLine = 14;
  const linesPerPage = 14;
  const charsPerPage = charsPerLine * linesPerPage;
  const pageIndex = 0;
  const pageText = readerText.slice(
    pageIndex * charsPerPage,
    (pageIndex + 1) * charsPerPage,
  );

  if (!readerText) {
    return <EmptyMessage message="You haven't added any text." />;
  }

  return (
    <section className="max-h-[70vh] w-full max-w-2xl grow overflow-auto px-2 text-center text-2xl">
      {chunk(pageText.split(""), charsPerLine).map((line, y) => {
        return (
          <div key={`${readerDate}-${y}`}>
            {line.map((char, x) => {
              return (
                <button
                  key={`${readerDate}-${y}-${x}`}
                  className={cn(
                    "inline-flex h-8 w-6 items-center justify-center",
                    selection?.x === x && selection.y === y && "bg-blue-600",
                  )}
                  onClick={() => setSelection({ x, y })}
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

const chunk = <T,>(values: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  let lastChunk: T[] = [];
  for (const [i, value] of values.entries()) {
    lastChunk.push(value);
    if (lastChunk.length >= size || i === values.length - 1) {
      chunks.push(lastChunk);
      lastChunk = [];
    }
  }
  return chunks;
};

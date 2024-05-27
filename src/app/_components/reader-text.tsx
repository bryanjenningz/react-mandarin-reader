import { useState } from "react";
import { EmptyMessage } from "./empty-message";
import { cn } from "../_utils/class-names";
import { chunk } from "../_utils/chunk";

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
  const [pageIndex, setPageIndex] = useState(0);
  const charsPerLine = 14;
  const linesPerPage = 14;
  const charsPerPage = charsPerLine * linesPerPage;
  const pageText = readerText.slice(
    pageIndex * charsPerPage,
    (pageIndex + 1) * charsPerPage,
  );
  const pageCount = Math.ceil(readerText.length / charsPerPage);

  if (!readerText) {
    return <EmptyMessage message="You haven't added any text." />;
  }

  return (
    <div>
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

      <div className="flex items-center justify-between">
        <button
          className="h-12 w-12 rounded-lg bg-blue-900 text-white transition hover:brightness-110"
          onClick={() => {
            setPageIndex((pageIndex) => Math.max(0, pageIndex - 1));
          }}
        >
          Prev
        </button>
        <div className="text-xl">{`${pageIndex + 1} / ${pageCount}`}</div>
        <button
          className="h-12 w-12 rounded-lg bg-blue-900 text-white transition hover:brightness-110"
          onClick={() => {
            setPageIndex((pageIndex) =>
              Math.min(Math.max(0, pageCount - 1), pageIndex + 1),
            );
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

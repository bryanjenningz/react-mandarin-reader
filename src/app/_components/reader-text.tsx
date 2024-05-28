import { useEffect, useState } from "react";
import { EmptyMessage } from "./empty-message";
import { cn } from "../_utils/class-names";
import { chunk } from "../_utils/chunk";
import { useDictionaryStore } from "../_stores/dictionary";
import { lookupLongest } from "../_utils/dictionary";

export const ReaderText = ({
  readerText,
  readerDate,
}: {
  readerText: string;
  readerDate: number;
}): JSX.Element => {
  const loadDictionary = useDictionaryStore((x) => x.loadDictionary);
  const dictionary = useDictionaryStore((x) => x.dictionary);
  const [selection, setSelection] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [pageIndex, setPageIndex] = useState(0);
  useEffect(() => loadDictionary(), [loadDictionary]);

  if (!readerText) {
    return <EmptyMessage message="You haven't added any text." />;
  }

  const charsPerLine = 14;
  const linesPerPage = 14;
  const charsPerPage = charsPerLine * linesPerPage;
  const pageText = readerText.slice(
    pageIndex * charsPerPage,
    (pageIndex + 1) * charsPerPage,
  );
  const pageCount = Math.ceil(readerText.length / charsPerPage);

  const maxSelectedTextLength = 12;
  const selectedIndex = selection
    ? selection.y * charsPerLine + selection.x
    : null;
  const selectedText =
    selectedIndex !== null
      ? pageText.slice(selectedIndex, selectedIndex + maxSelectedTextLength)
      : "";
  const dictionaryEntry = lookupLongest(dictionary, selectedText);

  return (
    <div className="flex grow flex-col justify-between px-2 pb-4 ps-2">
      <section className="max-h-[70vh] w-full max-w-2xl grow overflow-auto text-center text-2xl">
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

      {dictionaryEntry && (
        <article>
          <div>{dictionaryEntry.traditional}</div>
          {dictionaryEntry.simplified !== dictionaryEntry.traditional && (
            <div>{dictionaryEntry.simplified}</div>
          )}
          <div>{dictionaryEntry.pinyin}</div>
          <div>{dictionaryEntry.meanings.join(", ")}</div>
        </article>
      )}

      <div className="flex items-center justify-between">
        <button
          className="h-12 w-12 rounded-lg bg-blue-900 text-white transition hover:brightness-110"
          onClick={() => {
            setPageIndex((pageIndex) => Math.max(0, pageIndex - 1));
            setSelection(null);
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
            setSelection(null);
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

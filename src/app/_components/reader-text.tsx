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
  const [selection, setSelection] = useState(-1);

  if (!readerText) {
    return <EmptyMessage message="You haven't added any text." />;
  }

  return (
    <section className="max-h-[70vh] w-full max-w-2xl grow overflow-auto px-2 text-center text-2xl">
      {readerText.split("").map((char, i) => {
        return (
          <button
            key={`${readerDate}-${i}`}
            className={cn(
              "inline-flex h-8 w-6 items-center justify-center",
              selection === i && "bg-blue-600",
            )}
            onClick={() => setSelection(i)}
          >
            {char}
          </button>
        );
      })}
    </section>
  );
};

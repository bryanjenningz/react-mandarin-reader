import { EmptyMessage } from "./empty-message";

export const ReaderText = ({
  readerText,
  readerDate,
}: {
  readerText: string;
  readerDate: number;
}): JSX.Element => {
  if (!readerText) {
    return <EmptyMessage message="You haven't added any text." />;
  }

  return (
    <p className="max-h-[70vh] w-full max-w-2xl grow overflow-auto px-2 text-center text-2xl">
      {readerText.split("").map((char, i) => {
        return <div key={`${readerDate}-${i}`}>{char}</div>;
      })}
    </p>
  );
};

import { EmptyMessage } from "./empty-message";

export const ReaderText = ({
  readerText,
}: {
  readerText: string;
}): JSX.Element => {
  if (!readerText) {
    return <EmptyMessage message="You haven't added any text." />;
  }

  return (
    <p className="max-h-[70vh] w-full max-w-2xl grow overflow-auto px-2 text-center text-2xl">
      {readerText}
    </p>
  );
};

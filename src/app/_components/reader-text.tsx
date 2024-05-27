import { EmptyMessage } from "./empty-message";

export const ReaderText = ({
  readerText,
}: {
  readerText: string;
}): JSX.Element => {
  if (!readerText) {
    return <EmptyMessage message="You haven't added any text." />;
  }

  return <p className="w-full max-w-2xl grow p-4">{readerText}</p>;
};

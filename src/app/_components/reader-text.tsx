import { StarIcon } from "../_icons/star";

export const ReaderText = ({
  readerText,
}: {
  readerText: string;
}): JSX.Element => {
  if (!readerText) {
    return (
      <article className="flex grow flex-col items-center justify-center gap-4">
        <StarIcon width={120} height={120} />
        <p>{`You haven't added any text.`}</p>
        <button className="rounded-lg bg-blue-900 px-4 py-2 text-white transition hover:brightness-110">
          Take the tutorial
        </button>
      </article>
    );
  }

  return <p className="w-full max-w-2xl grow">{readerText}</p>;
};

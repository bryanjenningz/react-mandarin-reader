import { StarIcon } from "../_icons/star";

export const EmptyMessage = ({ message }: { message: string }): JSX.Element => {
  return (
    <article className="flex grow flex-col items-center justify-center gap-4">
      <StarIcon width={120} height={120} />
      <p>{message}</p>
      <button className="rounded-lg bg-blue-900 px-4 py-2 text-white transition hover:brightness-110">
        Take the tutorial
      </button>
    </article>
  );
};

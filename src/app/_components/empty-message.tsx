import { useEffect, useState } from "react";
import { StarIcon } from "../_icons/star";
import { cn } from "../_utils/class-names";

export const EmptyMessage = ({ message }: { message: string }): JSX.Element => {
  // We hide the empty message on the first render while Zustand is getting the
  // persisted state from localStorage.
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    setIsShown(true);
  }, []);

  return (
    <article
      className={cn(
        "flex grow flex-col items-center justify-center gap-4 text-base",
        isShown ? "opacity-100" : "opacity-0",
      )}
    >
      <StarIcon width={120} height={120} />
      <p>{message}</p>
      <button className="rounded-lg bg-blue-900 px-4 py-2 text-white transition hover:brightness-110">
        Take the tutorial
      </button>
    </article>
  );
};

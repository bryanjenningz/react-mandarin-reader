import { useEffect, useState } from "react";
import Link from "next/link";
import { StarIcon } from "../_icons/star";
import { cn } from "../_utils/class-names";
import { useStateStore } from "../_stores/state";

export const EmptyMessage = ({ message }: { message: string }): JSX.Element => {
  // We hide the empty message on the first render while Zustand is getting the
  // persisted state from localStorage.
  const [isShown, setIsShown] = useState(false);
  const dispatch = useStateStore((x) => x.dispatch);

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
      <Link
        href="/tutorial"
        className="rounded-lg bg-blue-900 px-4 py-2 text-white transition hover:brightness-110"
        onClick={() => dispatch({ type: "CLOSE_MENU" })}
      >
        Take the tutorial
      </Link>
    </article>
  );
};

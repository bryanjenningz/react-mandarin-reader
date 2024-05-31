import { MenuIcon } from "../_icons/menu";
import { useStateStore } from "../_stores/state";

export const SimpleHeader = ({
  title,
  rightButton,
}: {
  title: string;
  rightButton?: JSX.Element;
}): JSX.Element => {
  const dispatch = useStateStore((x) => x.dispatch);

  return (
    <header className="flex h-14 w-full max-w-2xl items-center">
      <button
        className="flex h-14 w-14 shrink-0 items-center justify-center"
        onClick={() => dispatch({ type: "OPEN_MENU" })}
      >
        <MenuIcon width={32} height={32} />
        <span className="sr-only">Open menu</span>
      </button>
      <h1 className="grow text-center text-2xl">{title}</h1>
      <div className="flex h-14 w-14 items-center justify-center">
        {rightButton}
      </div>
    </header>
  );
};

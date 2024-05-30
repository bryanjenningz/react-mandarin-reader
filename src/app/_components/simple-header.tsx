import { MenuIcon } from "../_icons/menu";

export const SimpleHeader = ({
  title,
  setIsSideMenuOpen,
  rightButton,
}: {
  title: string;
  setIsSideMenuOpen: (isSideMenuOpen: boolean) => void;
  rightButton?: JSX.Element;
}): JSX.Element => {
  return (
    <header className="flex h-12 w-full max-w-2xl items-center">
      <button
        className="flex h-12 w-12 shrink-0 items-center justify-center"
        onClick={() => setIsSideMenuOpen(true)}
      >
        <MenuIcon />
        <span className="sr-only">Open menu</span>
      </button>
      <h1 className="grow text-center text-xl">{title}</h1>
      <div className="flex h-12 w-12 items-center justify-center">
        {rightButton}
      </div>
    </header>
  );
};

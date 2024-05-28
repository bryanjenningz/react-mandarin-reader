import { MenuIcon } from "~/app/_icons/menu";

export const BrowseFlashcardsHeader = ({
  setIsSideMenuOpen,
}: {
  setIsSideMenuOpen: (isSideMenuOpen: boolean) => void;
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
      <h1 className="grow text-center text-xl">Flashcards</h1>
      <div className="flex h-12 w-12"></div>
    </header>
  );
};

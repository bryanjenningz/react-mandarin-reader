import { ContentPasteGoIcon } from "../_icons/content-paste-go";
import { MenuIcon } from "../_icons/menu";

export const ReaderHeader = ({
  setIsSideMenuOpen,
  setReaderText,
}: {
  setIsSideMenuOpen: (isSideMenuOpen: boolean) => void;
  setReaderText: (readerText: string) => void;
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
      <h1 className="grow text-center text-xl">Reader</h1>
      <button
        className="flex h-12 w-12 shrink-0 items-center justify-center"
        onClick={() => {
          void (async () => {
            try {
              setReaderText(await navigator.clipboard.readText());
            } catch {
              setReaderText(prompt("Paste Mandarin text")?.trim() ?? "");
            }
          })();
        }}
      >
        <ContentPasteGoIcon />
        <span className="sr-only">Paste clipboard</span>
      </button>
    </header>
  );
};

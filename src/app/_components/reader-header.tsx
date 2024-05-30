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
    <header className="flex h-14 w-full max-w-2xl items-center">
      <button
        className="flex h-14 w-14 shrink-0 items-center justify-center"
        onClick={() => setIsSideMenuOpen(true)}
      >
        <MenuIcon width={32} height={32} />
        <span className="sr-only">Open menu</span>
      </button>
      <h1 className="grow text-center text-2xl">Reader</h1>
      <button
        className="flex h-14 w-14 shrink-0 items-center justify-center"
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
        <ContentPasteGoIcon width={32} height={32} />
        <span className="sr-only">Paste clipboard</span>
      </button>
    </header>
  );
};

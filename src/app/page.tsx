"use client";

import { useState } from "react";
import { SideMenu } from "./_components/side-menu";
import { ContentPasteGoIcon } from "./_icons/content-paste-go";
import { MenuIcon } from "./_icons/menu";
import { StarIcon } from "./_icons/star";

const HomePage = (): JSX.Element => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [readerText, setReaderText] = useState("");

  return (
    <div className="flex min-h-screen flex-col items-center bg-black text-white">
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

      {((): JSX.Element => {
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
      })()}

      <SideMenu
        selectedItem="Reader"
        isSideMenuOpen={isSideMenuOpen}
        setIsSideMenuOpen={setIsSideMenuOpen}
      />
    </div>
  );
};

export default HomePage;

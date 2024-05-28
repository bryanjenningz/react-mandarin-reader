"use client";

import { useState } from "react";
import { useStateStore } from "~/app/_stores/state";
import { SideMenu } from "~/app/_components/side-menu";
import { BrowseFlashcardsHeader } from "./_components/browse-flashcards-header";
import { EmptyMessage } from "../_components/empty-message";

const BrowseFlashcardsPage = (): JSX.Element => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const flashcards = useStateStore((state) => state.flashcards);

  return (
    <div className="flex min-h-screen flex-col items-center bg-black text-white">
      <BrowseFlashcardsHeader setIsSideMenuOpen={setIsSideMenuOpen} />

      {((): JSX.Element => {
        if (flashcards.length === 0) {
          return <EmptyMessage message="You haven't saved any flashcards." />;
        }

        return (
          <ul className="flex w-full max-w-2xl flex-col">
            {flashcards.map((flashcard) => {
              return (
                <li key={flashcard.entry.traditional} className="w-full">
                  <button className="flex w-full flex-col px-4 py-2">
                    <span className="flex items-center gap-2">
                      <span className="text-xl">
                        {flashcard.entry.traditional}
                      </span>
                      {flashcard.entry.traditional !==
                        flashcard.entry.simplified && (
                        <span className="text-xl">
                          {flashcard.entry.simplified}
                        </span>
                      )}
                      <span>{flashcard.entry.pinyin}</span>
                    </span>
                    <span className="text-sm text-slate-400">
                      {flashcard.entry.meanings.join(", ")}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        );
      })()}

      <SideMenu
        selectedItem="Browse flashcards"
        isSideMenuOpen={isSideMenuOpen}
        setIsSideMenuOpen={setIsSideMenuOpen}
      />
    </div>
  );
};

export default BrowseFlashcardsPage;

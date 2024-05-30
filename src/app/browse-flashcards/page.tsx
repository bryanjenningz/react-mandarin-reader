"use client";

import { useState } from "react";
import { useStateStore } from "~/app/_stores/state";
import { SideMenu } from "~/app/_components/side-menu";

import { EmptyMessage } from "../_components/empty-message";
import { SimpleHeader } from "../_components/simple-header";
import { DeleteForever } from "../_icons/delete-forever";

const BrowseFlashcardsPage = (): JSX.Element => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const flashcards = useStateStore((x) => x.flashcards);
  const dispatch = useStateStore((x) => x.dispatch);

  return (
    <div className="flex min-h-screen flex-col items-center bg-black text-white">
      <SimpleHeader title="Flashcards" setIsSideMenuOpen={setIsSideMenuOpen} />

      {((): JSX.Element => {
        if (flashcards.length === 0) {
          return <EmptyMessage message="You haven't saved any flashcards." />;
        }

        return (
          <div className="flex w-full max-w-2xl flex-col">
            <div className="flex gap-2 bg-slate-800 px-4 text-sm">
              <span>Flashcard count:</span>
              <span>{flashcards.length}</span>
            </div>
            <ul>
              {flashcards.map((flashcard) => {
                return (
                  <li key={flashcard.entry.traditional} className="flex w-full">
                    <span className="flex w-full items-center py-2 pl-4">
                      <span className="flex grow flex-col">
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
                        <span className="line-clamp-2 text-left text-sm text-slate-400">
                          {flashcard.entry.meanings.join(", ")}
                        </span>
                      </span>
                      <button
                        className="flex h-12 w-12 shrink-0 items-center justify-center"
                        onClick={() => {
                          dispatch({
                            type: "ADD_OR_REMOVE_FLASHCARD",
                            entry: flashcard.entry,
                          });
                        }}
                      >
                        <DeleteForever />
                        <span className="sr-only">Delete flashcard</span>
                      </button>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
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

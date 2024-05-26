"use client";

import { HearingIcon } from "../_icons/hearing";
import { HistoryIcon } from "../_icons/history";
import { ManageSearch } from "../_icons/manage-search";
import { MenuBookIcon } from "../_icons/menu-book";
import { PictureAsPdfIcon } from "../_icons/picture-as-pdf";
import { SchoolIcon } from "../_icons/school";
import { SettingsIcon } from "../_icons/settings";
import { SubtitlesIcon } from "../_icons/subtitles";
import { TranslateIcon } from "../_icons/translate";
import { cn } from "../utils/class-names";

export const SideMenu = ({
  isSideMenuOpen,
  setIsSideMenuOpen,
}: {
  isSideMenuOpen: boolean;
  setIsSideMenuOpen: (isSideMenuOpen: boolean) => void;
}): JSX.Element => {
  return (
    <>
      {isSideMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-70 transition-opacity"
          onClick={() => setIsSideMenuOpen(false)}
        ></div>
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 flex flex-col bg-black text-white transition-[left]",
          isSideMenuOpen ? "left-0" : "-left-80",
        )}
      >
        <h2 className="flex h-12 items-center justify-center text-xl">Menu</h2>

        <h3 className="bg-slate-800 px-4 py-1 text-sm uppercase">Reader</h3>
        <div className="flex items-center gap-2 px-4 py-1 text-lg">
          <MenuBookIcon />
          Reader
        </div>
        <div className="flex items-center gap-2 px-4 py-1 text-lg">
          <PictureAsPdfIcon />
          Import PDF
        </div>
        <div className="flex items-center gap-2 px-4 py-1 text-lg">
          <SubtitlesIcon />
          Import subtitles
        </div>
        <div className="flex items-center gap-2 px-4 py-1 text-lg">
          <HistoryIcon />
          History
        </div>

        <h3 className="bg-slate-800 px-4 py-1 text-sm uppercase">Flashcards</h3>
        <div className="flex items-center gap-2 px-4 py-1 text-lg">
          <ManageSearch />
          Browse flashcards
        </div>
        <div className="flex items-center gap-2 px-4 py-1 text-lg">
          <HearingIcon />
          Audio-only
        </div>
        <div className="flex items-center gap-2 px-4 py-1 text-lg">
          <SchoolIcon />
          Mandarin to English
        </div>
        <div className="flex items-center gap-2 px-4 py-1 text-lg">
          <TranslateIcon />
          English to Mandarin
        </div>

        <h3 className="bg-slate-800 px-4 py-1 text-sm uppercase">Settings</h3>
        <div className="flex items-center gap-2 px-4 py-1 text-lg">
          <SettingsIcon />
          Settings
        </div>
      </aside>
    </>
  );
};

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
import { cn } from "../_utils/class-names";

type MenuSection = {
  name: string;
  items: MenuItem[];
};

type MenuItem = {
  name: string;
  icon: JSX.Element;
};

const menuSections: MenuSection[] = [
  {
    name: "Reader",
    items: [
      { name: "Reader", icon: <MenuBookIcon /> },
      { name: "Import PDF", icon: <PictureAsPdfIcon /> },
      { name: "Import subtitles", icon: <SubtitlesIcon /> },
      { name: "History", icon: <HistoryIcon /> },
    ],
  },
  {
    name: "Flashcards",
    items: [
      { name: "Browse flashcards", icon: <ManageSearch /> },
      { name: "Audio only", icon: <HearingIcon /> },
      { name: "Mandarin to English", icon: <SchoolIcon /> },
      { name: "English to Mandarin", icon: <TranslateIcon /> },
    ],
  },
  {
    name: "Settings",
    items: [{ name: "Settings", icon: <SettingsIcon /> }],
  },
];

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

        {menuSections.map((menuSection) => {
          return (
            <section key={menuSection.name}>
              <h3 className="bg-slate-800 px-4 py-1 text-sm uppercase">
                {menuSection.name}
              </h3>

              {menuSection.items.map((menuItem) => {
                return (
                  <div
                    key={menuItem.name}
                    className="flex items-center gap-2 px-4 py-1 text-lg"
                  >
                    {menuItem.icon}
                    {menuItem.name}
                  </div>
                );
              })}
            </section>
          );
        })}
      </aside>
    </>
  );
};

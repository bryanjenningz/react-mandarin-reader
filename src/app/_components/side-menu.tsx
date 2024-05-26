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

const menuSections = [
  {
    name: "Reader",
    items: [
      { name: "Reader", icon: <MenuBookIcon /> },
      { name: "History", icon: <HistoryIcon /> },
      { name: "Import PDF", icon: <PictureAsPdfIcon /> },
      { name: "Import subtitles", icon: <SubtitlesIcon /> },
    ],
  },
  {
    name: "Flashcards",
    items: [
      { name: "Browse flashcards", icon: <ManageSearch /> },
      { name: "Mandarin to English", icon: <SchoolIcon /> },
      { name: "English to Mandarin", icon: <TranslateIcon /> },
      { name: "Audio only", icon: <HearingIcon /> },
    ],
  },
  {
    name: "Settings",
    items: [{ name: "Settings", icon: <SettingsIcon /> }],
  },
  {
    name: "Tutorial",
    items: [{ name: "Tutorial", icon: <SchoolIcon /> }],
  },
] as const satisfies MenuSection[];

type SelectedMenuItemName =
  (typeof menuSections)[number]["items"][number]["name"];

export const SideMenu = ({
  selectedItem,
  isSideMenuOpen,
  setIsSideMenuOpen,
}: {
  selectedItem: SelectedMenuItemName;
  isSideMenuOpen: boolean;
  setIsSideMenuOpen: (isSideMenuOpen: boolean) => void;
}): JSX.Element => {
  return (
    <>
      {isSideMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-80 transition-opacity"
          onClick={() => setIsSideMenuOpen(false)}
        ></div>
      )}

      <aside
        className={cn(
          "fixed bottom-0 left-0 top-0 flex flex-col bg-black  text-white shadow shadow-slate-800 transition-[left]",
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
                    className={cn(
                      "flex items-center gap-2 px-4 py-1 text-lg",
                      menuItem.name === selectedItem && "bg-blue-900",
                    )}
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

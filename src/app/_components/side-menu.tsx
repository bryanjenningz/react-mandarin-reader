"use client";

import Link from "next/link";
import { HearingIcon } from "../_icons/hearing";
import { HistoryIcon } from "../_icons/history";
import { LocalLibraryIcon } from "../_icons/local-library";
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
  href: string;
};

const menuSections = [
  {
    name: "Reader",
    items: [
      { name: "Reader", icon: <MenuBookIcon />, href: "/" },
      { name: "History", icon: <HistoryIcon />, href: "/reader-history" },
      { name: "Import PDF", icon: <PictureAsPdfIcon />, href: "/import-pdf" },
      {
        name: "Import subtitles",
        icon: <SubtitlesIcon />,
        href: "/import-subtitles",
      },
    ],
  },
  {
    name: "Flashcards",
    items: [
      {
        name: "Browse flashcards",
        icon: <ManageSearch />,
        href: "/browse-flashcards",
      },
      {
        name: "Mandarin to English",
        icon: <LocalLibraryIcon />,
        href: "/mandarin-to-english-flashcards",
      },
      {
        name: "English to Mandarin",
        icon: <TranslateIcon />,
        href: "/english-to-mandarin-flashcards",
      },
      {
        name: "Audio flashcards",
        icon: <HearingIcon />,
        href: "/audio-flashcards",
      },
    ],
  },
  {
    name: "Settings",
    items: [{ name: "Settings", icon: <SettingsIcon />, href: "/settings" }],
  },
  {
    name: "Tutorial",
    items: [{ name: "Tutorial", icon: <SchoolIcon />, href: "/tutorial" }],
  },
] as const satisfies MenuSection[];

export type MenuItemName =
  (typeof menuSections)[number]["items"][number]["name"];

export const SideMenu = ({
  selectedItem,
  isSideMenuOpen,
  setIsSideMenuOpen,
}: {
  selectedItem: MenuItemName;
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
          "fixed bottom-0 top-0 flex flex-col bg-black text-white shadow shadow-slate-800 transition-[left]",
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
                  <Link
                    key={menuItem.name}
                    href={menuItem.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 text-lg",
                      menuItem.name === selectedItem && "bg-blue-900",
                    )}
                  >
                    {menuItem.icon}
                    {menuItem.name}
                  </Link>
                );
              })}
            </section>
          );
        })}
      </aside>
    </>
  );
};

"use client";

import { useState } from "react";
import { SideMenu } from "./_components/side-menu";
import { ContentPasteGoIcon } from "./_icons/content-paste-go";
import { MenuIcon } from "./_icons/menu";

const HomePage = (): JSX.Element => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

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
        <button className="flex h-12 w-12 shrink-0 items-center justify-center">
          <ContentPasteGoIcon />
          <span className="sr-only">Paste clipboard</span>
        </button>
      </header>

      <SideMenu
        isSideMenuOpen={isSideMenuOpen}
        setIsSideMenuOpen={setIsSideMenuOpen}
      />
    </div>
  );
};

export default HomePage;

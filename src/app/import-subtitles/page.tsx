"use client";

import { useState } from "react";
import { SideMenu } from "~/app/_components/side-menu";
import { SubtitlesIcon } from "~/app/_icons/subtitles";
import { ImportSubtitlesHeader } from "./_components/import-subtitles-header";

const ImportSubtitlesPage = (): JSX.Element => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center bg-black text-white">
      <ImportSubtitlesHeader setIsSideMenuOpen={setIsSideMenuOpen} />

      <div className="flex grow flex-col items-center justify-center gap-2">
        <SubtitlesIcon width={120} height={120} />
        <button className="rounded-lg bg-blue-900 px-4 py-2 text-white transition hover:brightness-110">
          Import subtitles
        </button>
      </div>

      <SideMenu
        selectedItem="Import subtitles"
        isSideMenuOpen={isSideMenuOpen}
        setIsSideMenuOpen={setIsSideMenuOpen}
      />
    </div>
  );
};

export default ImportSubtitlesPage;

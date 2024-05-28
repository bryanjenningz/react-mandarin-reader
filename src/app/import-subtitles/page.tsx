"use client";

import { useState } from "react";
import { SideMenu } from "~/app/_components/side-menu";
import { SubtitlesIcon } from "~/app/_icons/subtitles";
import { ImportSubtitlesHeader } from "./_components/import-subtitles-header";

const ImportSubtitlesPage = (): JSX.Element => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [subtitlesText, setSubtitlesText] = useState("");

  return (
    <div className="flex min-h-screen flex-col items-center bg-black text-white">
      <ImportSubtitlesHeader setIsSideMenuOpen={setIsSideMenuOpen} />

      <div className="flex grow flex-col items-center justify-center gap-2">
        <SubtitlesIcon width={120} height={120} />
        <input
          type="file"
          className="max-w-80 rounded-lg bg-blue-900 px-4 py-2 text-white transition hover:brightness-110"
          onChange={(event) => {
            if (!event.target.files?.[0]) return;
            const fileReader = new FileReader();
            fileReader.readAsText(event.target.files[0]);
            fileReader.onload = () => {
              const fileText = fileReader.result;
              if (typeof fileText === "string") {
                setSubtitlesText(fileText);
              }
            };
          }}
        />

        {subtitlesText && (
          <div className="flex flex-col items-center gap-2 py-4">
            <h2>Preview</h2>
            <div className="line-clamp-4 overflow-auto px-4 text-slate-400">
              {subtitlesText}
            </div>
          </div>
        )}

        <button className="rounded-lg bg-blue-900 px-4 py-2 text-white transition hover:brightness-110">
          Save subtitles
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

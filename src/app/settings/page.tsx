"use client";

import { useState } from "react";
import { SideMenu } from "~/app/_components/side-menu";
import { SettingsHeader } from "./_components/settings-header";

type SettingsOption = { name: string; description: string; enabled: boolean };

const settingsOptions: SettingsOption[] = [
  {
    name: "Play audio on word lookup",
    description:
      "Autoplay the pronunciation audio on each word lookup in the reader.",
    enabled: true,
  },
];

const SettingsPage = (): JSX.Element => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center bg-black text-white">
      <SettingsHeader setIsSideMenuOpen={setIsSideMenuOpen} />

      <ul className="w-full max-w-2xl">
        {settingsOptions.map((settingsOption) => {
          return (
            <li key={settingsOption.name} className="w-full">
              <button className="w-full p-4 text-left">
                <span className="flex items-center gap-2">
                  <span className="flex flex-col gap-2">
                    <span className="">{settingsOption.name}</span>
                    <span className="text-sm text-slate-400">
                      {settingsOption.description}
                    </span>
                  </span>
                  <input
                    className="h-6 w-6"
                    type="checkbox"
                    checked={settingsOption.enabled}
                  ></input>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <SideMenu
        selectedItem="Settings"
        isSideMenuOpen={isSideMenuOpen}
        setIsSideMenuOpen={setIsSideMenuOpen}
      />
    </div>
  );
};

export default SettingsPage;

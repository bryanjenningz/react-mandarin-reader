"use client";

import { useState } from "react";
import { SideMenu } from "~/app/_components/side-menu";
import { SettingsHeader } from "./_components/settings-header";
import { useStateStore } from "../_stores/state";

const SettingsPage = (): JSX.Element => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const settings = useStateStore((x) => x.settings);
  const dispatch = useStateStore((x) => x.dispatch);

  return (
    <div className="flex min-h-screen flex-col items-center bg-black text-white">
      <SettingsHeader setIsSideMenuOpen={setIsSideMenuOpen} />

      <ul className="w-full max-w-2xl">
        {settings.map((settingsOption) => {
          return (
            <li key={settingsOption.name} className="w-full">
              <button
                className="w-full p-4 text-left"
                onClick={() => {
                  dispatch({
                    type: "TOGGLE_SETTINGS_OPTION",
                    name: settingsOption.name,
                  });
                }}
              >
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
                    // Do nothing on change because we're already handling the state change on the button click
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    onChange={() => {}}
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

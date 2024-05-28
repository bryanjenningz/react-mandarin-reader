"use client";

import { useState } from "react";
import { SideMenu } from "~/app/_components/side-menu";
import { SettingsHeader } from "./_components/settings-header";

const SettingsPage = (): JSX.Element => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center bg-black text-white">
      <SettingsHeader setIsSideMenuOpen={setIsSideMenuOpen} />

      <SideMenu
        selectedItem="Settings"
        isSideMenuOpen={isSideMenuOpen}
        setIsSideMenuOpen={setIsSideMenuOpen}
      />
    </div>
  );
};

export default SettingsPage;

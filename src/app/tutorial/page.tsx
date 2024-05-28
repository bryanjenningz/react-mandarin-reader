"use client";

import { useState } from "react";
import { SideMenu } from "~/app/_components/side-menu";
import { TutorialHeader } from "./_components/tutorial-header";

const TutorialPage = (): JSX.Element => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center bg-black text-white">
      <TutorialHeader setIsSideMenuOpen={setIsSideMenuOpen} />

      <SideMenu
        selectedItem="Tutorial"
        isSideMenuOpen={isSideMenuOpen}
        setIsSideMenuOpen={setIsSideMenuOpen}
      />
    </div>
  );
};

export default TutorialPage;

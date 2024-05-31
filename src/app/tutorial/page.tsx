"use client";

import { SideMenu } from "~/app/_components/side-menu";
import { SimpleHeader } from "../_components/simple-header";

const TutorialPage = (): JSX.Element => {
  return (
    <div className="flex min-h-screen flex-col items-center bg-black text-white">
      <SimpleHeader title="Tutorial" />

      <SideMenu selectedItem="Tutorial" />
    </div>
  );
};

export default TutorialPage;

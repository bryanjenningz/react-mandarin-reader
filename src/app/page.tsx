"use client";

import { useState } from "react";
import { SideMenu } from "./_components/side-menu";
import { ReaderHeader } from "./_components/reader-header";
import { ReaderText } from "./_components/reader-text";

const HomePage = (): JSX.Element => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [readerText, setReaderText] = useState("");

  return (
    <div className="flex min-h-screen flex-col items-center bg-black text-white">
      <ReaderHeader
        setIsSideMenuOpen={setIsSideMenuOpen}
        setReaderText={setReaderText}
      />

      <ReaderText readerText={readerText} />

      <SideMenu
        selectedItem="Reader"
        isSideMenuOpen={isSideMenuOpen}
        setIsSideMenuOpen={setIsSideMenuOpen}
      />
    </div>
  );
};

export default HomePage;

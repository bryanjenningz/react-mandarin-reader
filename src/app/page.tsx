"use client";

import { useState } from "react";
import { SideMenu } from "./_components/side-menu";
import { ReaderHeader } from "./_components/reader-header";
import { ReaderText } from "./_components/reader-text";
import { useStateStore } from "./_stores/state";

const HomePage = (): JSX.Element => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const reader = useStateStore((state) => state.reader);
  const dispatch = useStateStore((state) => state.dispatch);

  return (
    <div className="flex min-h-screen flex-col items-center bg-black text-white">
      <ReaderHeader
        setIsSideMenuOpen={setIsSideMenuOpen}
        setReaderText={(readerText) => {
          dispatch({
            type: "PASTE_READER_TEXT",
            text: readerText,
            date: Date.now(),
          });
        }}
      />

      <ReaderText readerText={reader.text} readerDate={reader.date} />

      <SideMenu
        selectedItem="Reader"
        isSideMenuOpen={isSideMenuOpen}
        setIsSideMenuOpen={setIsSideMenuOpen}
      />
    </div>
  );
};

export default HomePage;

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
    <div className="flex h-screen flex-col items-center overflow-hidden bg-black text-white">
      <div className="flex h-full w-full max-w-2xl grow flex-col">
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

        <ReaderText
          readerText={reader.text}
          readerDate={reader.date}
          pageIndex={reader.pageIndex}
          incrementPage={() => {
            dispatch({ type: "INCREMENT_PAGE_INDEX" });
          }}
          decrementPage={() => {
            dispatch({ type: "DECREMENT_PAGE_INDEX" });
          }}
        />

        <SideMenu
          selectedItem="Reader"
          isSideMenuOpen={isSideMenuOpen}
          setIsSideMenuOpen={setIsSideMenuOpen}
        />
      </div>
    </div>
  );
};

export default HomePage;

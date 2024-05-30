"use client";

import { useState } from "react";
import { SideMenu } from "./_components/side-menu";
import { ReaderHeader } from "./_components/reader-header";
import { ReaderText, getCharsPerPage } from "./_components/reader-text";
import { useStateStore } from "./_stores/state";
import { ReaderBottomNav } from "./_components/reader-bottom-nav";

const HomePage = (): JSX.Element => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const reader = useStateStore((state) => state.reader);
  const dispatch = useStateStore((state) => state.dispatch);
  const readerSize = useStateStore((x) => x.readerSize);
  const { charsPerPage } = getCharsPerPage(readerSize);
  const pageCount = Math.ceil(reader.text.length / charsPerPage);

  return (
    <div className="flex h-[100dvh] flex-col items-center overflow-hidden bg-black text-white">
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

        <div className="flex grow flex-col justify-between gap-2 px-2 pb-2">
          <ReaderText
            readerText={reader.text}
            readerDate={reader.date}
            readerSelection={reader.selection}
            setReaderSelection={(selection) => {
              dispatch({ type: "SET_READER_SELECTION", selection });
            }}
            pageIndex={reader.pageIndex}
          />

          <ReaderBottomNav
            pageIndex={reader.pageIndex}
            pageCount={pageCount}
            onClickLeft={() => dispatch({ type: "DECREMENT_PAGE_INDEX" })}
            onClickRight={() => dispatch({ type: "INCREMENT_PAGE_INDEX" })}
          />
        </div>

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

"use client";

import Link from "next/link";
import { useState } from "react";
import { useStateStore } from "~/app/_stores/state";
import { SideMenu } from "~/app/_components/side-menu";
import { ReaderHistoryHeader } from "./_components/reader-history-header";

const ReaderHistoryPage = (): JSX.Element => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const readerHistory = useStateStore((state) => state.readerHistory);
  const dispatch = useStateStore((state) => state.dispatch);

  return (
    <div className="flex min-h-screen flex-col items-center bg-black text-white">
      <ReaderHistoryHeader setIsSideMenuOpen={setIsSideMenuOpen} />

      <ul>
        {readerHistory.map((historyItem) => {
          return (
            <li key={historyItem.date}>
              <Link
                href="/"
                onClick={() => {
                  dispatch({ type: "SET_READER_TEXT", text: historyItem.text });
                }}
              >
                {historyItem.text}
              </Link>
            </li>
          );
        })}
      </ul>

      <SideMenu
        selectedItem="History"
        isSideMenuOpen={isSideMenuOpen}
        setIsSideMenuOpen={setIsSideMenuOpen}
      />
    </div>
  );
};

export default ReaderHistoryPage;

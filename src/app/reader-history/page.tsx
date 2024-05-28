"use client";

import { useState } from "react";
import { useStateStore } from "~/app/_stores/state";
import { SideMenu } from "~/app/_components/side-menu";
import { ReaderHistoryHeader } from "./_components/reader-history-header";
import { EmptyMessage } from "../_components/empty-message";
import { useRouter } from "next/navigation";

const ReaderHistoryPage = (): JSX.Element => {
  const router = useRouter();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const readerHistory = useStateStore((state) => state.readerHistory);
  const dispatch = useStateStore((state) => state.dispatch);

  return (
    <div className="flex min-h-screen flex-col items-center bg-black text-white">
      <ReaderHistoryHeader setIsSideMenuOpen={setIsSideMenuOpen} />

      {((): JSX.Element => {
        if (readerHistory.length === 0) {
          return <EmptyMessage message="You don't have any reader history." />;
        }

        return (
          <ul className="flex flex-col">
            {readerHistory.map((historyItem) => {
              return (
                <li key={historyItem.date}>
                  <button
                    onClick={() => {
                      console.log({
                        "historyItem.pageIndex": historyItem.pageIndex,
                      });
                      dispatch({
                        type: "SET_READER_TEXT",
                        text: historyItem.text,
                        date: historyItem.date,
                        pageIndex: historyItem.pageIndex,
                      });
                      void router.push("/");
                    }}
                    className="flex flex-col px-4 py-2"
                  >
                    <time className="text-left text-sm font-bold text-blue-500">
                      {formatTime(historyItem.date)}
                    </time>
                    <span className="line-clamp-4 text-sm">
                      {historyItem.text}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        );
      })()}

      <SideMenu
        selectedItem="History"
        isSideMenuOpen={isSideMenuOpen}
        setIsSideMenuOpen={setIsSideMenuOpen}
      />
    </div>
  );
};

export default ReaderHistoryPage;

const formatTime = (time: number): string => {
  const date = new Date(time);
  return (
    date.toLocaleDateString() +
    " " +
    date.toLocaleTimeString(undefined, {
      timeStyle: "short",
      hourCycle: "h12",
    })
  );
};

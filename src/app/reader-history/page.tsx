"use client";

import { useStateStore } from "~/app/_stores/state";
import { SideMenu } from "~/app/_components/side-menu";
import { EmptyMessage } from "../_components/empty-message";
import { useRouter } from "next/navigation";
import { SimpleHeader } from "../_components/simple-header";
import { DeleteForever } from "../_icons/delete-forever";

const ReaderHistoryPage = (): JSX.Element => {
  const router = useRouter();
  const readerHistory = useStateStore((state) => state.readerHistory);
  const dispatch = useStateStore((state) => state.dispatch);

  return (
    <div className="flex min-h-screen flex-col items-center bg-black text-white">
      <SimpleHeader title="History" />

      {((): JSX.Element => {
        if (readerHistory.length === 0) {
          return <EmptyMessage message="You don't have any reader history." />;
        }

        return (
          <ul className="flex flex-col">
            {readerHistory.map((historyItem) => {
              return (
                <li key={historyItem.date}>
                  <span className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        dispatch({
                          type: "SET_READER_TEXT",
                          text: historyItem.text,
                          date: historyItem.date,
                          pageIndex: historyItem.pageIndex,
                        });
                        void router.push("/");
                      }}
                      className="flex flex-col py-2 pl-4"
                    >
                      <time className="text-left text-sm font-bold text-blue-500">
                        {formatTime(historyItem.date)}
                      </time>
                      <span className="line-clamp-4 text-sm">
                        {historyItem.text}
                      </span>
                    </button>
                    <button
                      className="flex h-12 w-12 shrink-0 items-center justify-center"
                      onClick={() => {
                        dispatch({
                          type: "DELETE_READER_HISTORY_ITEM",
                          date: historyItem.date,
                        });
                      }}
                    >
                      <DeleteForever />
                      <span className="sr-only">Delete history item</span>
                    </button>
                  </span>
                </li>
              );
            })}
          </ul>
        );
      })()}

      <SideMenu selectedItem="History" />
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

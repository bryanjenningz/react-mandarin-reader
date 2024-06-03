"use client";

import { useState } from "react";
import { SideMenu } from "~/app/_components/side-menu";
import { SubtitlesIcon } from "~/app/_icons/subtitles";
import { useStateStore } from "../_stores/state";
import { useRouter } from "next/navigation";
import { formatSubtitles } from "./_utils/format-subtitles";
import { SimpleHeader } from "../_components/simple-header";

type UploadState =
  | { type: "NOTHING_UPLOADED" }
  | { type: "PARSING" }
  | { type: "ERROR_PARSING" }
  | { type: "UPLOADED"; value: string };

const ImportSubtitlesPage = (): JSX.Element => {
  const [subtitlesText, setSubtitlesText] = useState<UploadState>({
    type: "NOTHING_UPLOADED",
  });
  const dispatch = useStateStore((x) => x.dispatch);
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center bg-black text-white">
      <SimpleHeader title="Import subtitles" />

      <div className="flex grow flex-col items-center justify-center gap-2">
        <SubtitlesIcon width={120} height={120} />
        <input
          type="file"
          className="max-w-80 rounded-lg bg-blue-900 px-4 py-2 text-white transition hover:brightness-110"
          onChange={(event) => {
            if (!event.target.files?.[0]) return;
            setSubtitlesText({ type: "PARSING" });
            const fileReader = new FileReader();
            fileReader.readAsText(event.target.files[0]);
            fileReader.onload = () => {
              const fileText = fileReader.result;
              if (typeof fileText === "string") {
                const formattedText = formatSubtitles(fileText);
                if (formattedText) {
                  setSubtitlesText({
                    type: "UPLOADED",
                    value: formattedText,
                  });
                } else {
                  setSubtitlesText({ type: "ERROR_PARSING" });
                }
              } else {
                setSubtitlesText({ type: "ERROR_PARSING" });
              }
            };
            fileReader.onerror = () => {
              setSubtitlesText({ type: "ERROR_PARSING" });
            };
          }}
        />

        {((): JSX.Element => {
          switch (subtitlesText.type) {
            case "NOTHING_UPLOADED": {
              return <></>;
            }
            case "ERROR_PARSING": {
              return (
                <div className="flex w-full max-w-2xl flex-col items-center gap-2 p-4 text-center">
                  <h2 className="text-lg font-bold">Error parsing file</h2>
                  <p>{`Make sure you're uploading a VTT subtitle file which you can download from Invidious.`}</p>
                </div>
              );
            }
            case "PARSING": {
              return (
                <div className="flex flex-col items-center gap-2 py-4">
                  Loading...
                </div>
              );
            }
            case "UPLOADED": {
              return (
                <>
                  <div className="flex flex-col items-center gap-2 py-4">
                    <h2 className="text-lg font-bold">Preview</h2>
                    <div className="line-clamp-4 w-full max-w-2xl px-4 text-slate-400">
                      {subtitlesText.value.slice(0, 1000)}
                    </div>
                  </div>

                  <button
                    className="rounded-lg bg-blue-900 px-4 py-2 text-white transition hover:brightness-110"
                    onClick={() => {
                      dispatch({
                        type: "PASTE_READER_TEXT",
                        text: subtitlesText.value,
                        date: Date.now(),
                      });
                      router.push("/");
                    }}
                  >
                    Save subtitles
                  </button>
                </>
              );
            }
          }
        })()}
      </div>

      <SideMenu selectedItem="Import subtitles" />
    </div>
  );
};

export default ImportSubtitlesPage;

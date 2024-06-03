"use client";

import { useState } from "react";
import { SideMenu } from "../_components/side-menu";
import { PictureAsPdfIcon } from "../_icons/picture-as-pdf";
import { useStateStore } from "../_stores/state";
import { useRouter } from "next/navigation";
import { SimpleHeader } from "../_components/simple-header";

type UploadState =
  | { type: "NOTHING_UPLOADED" }
  | { type: "PARSING" }
  | { type: "ERROR_PARSING" }
  | { type: "UPLOADED"; value: string };

const ImportPdfPage = (): JSX.Element => {
  const [pdfText, setPdfText] = useState<UploadState>({
    type: "NOTHING_UPLOADED",
  });
  const dispatch = useStateStore((x) => x.dispatch);
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center bg-black text-white">
      <SimpleHeader title="Import PDF" />

      <div className="flex grow flex-col items-center justify-center gap-2">
        <PictureAsPdfIcon width={120} height={120} />

        <input
          type="file"
          className="max-w-80 rounded-lg bg-blue-900 px-4 py-2 text-white transition hover:brightness-110"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            void (async () => {
              setPdfText({ type: "PARSING" });
              try {
                const { default: pdfToText } = await import("react-pdftotext");
                const text = await pdfToText(file);
                setPdfText({ type: "UPLOADED", value: text });
              } catch {
                setPdfText({ type: "ERROR_PARSING" });
              }
            })();
          }}
        />

        {((): JSX.Element => {
          switch (pdfText.type) {
            case "NOTHING_UPLOADED": {
              return <></>;
            }
            case "ERROR_PARSING": {
              return (
                <div className="flex flex-col items-center gap-2 py-4">
                  Error parsing file
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
                    <h2>Preview</h2>
                    <div className="line-clamp-4 w-full max-w-2xl px-4 text-slate-400">
                      {pdfText.value.slice(0, 1000)}
                    </div>
                  </div>

                  <button
                    className="rounded-lg bg-blue-900 px-4 py-2 text-white transition hover:brightness-110"
                    onClick={() => {
                      if (pdfText) {
                        dispatch({
                          type: "PASTE_READER_TEXT",
                          text: pdfText.value,
                          date: Date.now(),
                        });
                        router.push("/");
                      }
                    }}
                  >
                    Save PDF
                  </button>
                </>
              );
            }
          }
        })()}
      </div>

      <SideMenu selectedItem="Import PDF" />
    </div>
  );
};

export default ImportPdfPage;

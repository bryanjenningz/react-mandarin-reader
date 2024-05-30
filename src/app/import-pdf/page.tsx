"use client";

import { useState } from "react";
import { SideMenu } from "../_components/side-menu";
import { PictureAsPdfIcon } from "../_icons/picture-as-pdf";
import { useStateStore } from "../_stores/state";
import { useRouter } from "next/navigation";
import { SimpleHeader } from "../_components/simple-header";

const ImportPdfPage = (): JSX.Element => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [pdfText, setPdfText] = useState("");
  const dispatch = useStateStore((x) => x.dispatch);
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center bg-black text-white">
      <SimpleHeader title="Import PDF" setIsSideMenuOpen={setIsSideMenuOpen} />

      <div className="flex grow flex-col items-center justify-center gap-2">
        <PictureAsPdfIcon width={120} height={120} />

        <input
          type="file"
          className="max-w-80 rounded-lg bg-blue-900 px-4 py-2 text-white transition hover:brightness-110"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            void (async () => {
              const { default: pdfToText } = await import("react-pdftotext");
              const text = await pdfToText(file);
              setPdfText(text);
            })();
          }}
        />

        {pdfText && (
          <div className="flex flex-col items-center gap-2 py-4">
            <h2>Preview</h2>
            <div className="line-clamp-4 overflow-auto px-4 text-slate-400">
              {pdfText}
            </div>
          </div>
        )}

        <button
          className="rounded-lg bg-blue-900 px-4 py-2 text-white transition hover:brightness-110"
          onClick={() => {
            if (pdfText) {
              dispatch({
                type: "PASTE_READER_TEXT",
                text: pdfText,
                date: Date.now(),
              });
              router.push("/");
            }
          }}
        >
          Save PDF
        </button>
      </div>

      <SideMenu
        selectedItem="Import PDF"
        isSideMenuOpen={isSideMenuOpen}
        setIsSideMenuOpen={setIsSideMenuOpen}
      />
    </div>
  );
};

export default ImportPdfPage;

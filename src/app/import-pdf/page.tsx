"use client";

import { useState } from "react";
import { SideMenu } from "../_components/side-menu";
import { PictureAsPdfIcon } from "../_icons/picture-as-pdf";
import { ImportPdfHeader } from "./_components/import-pdf-header";

const ImportPdfPage = (): JSX.Element => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center bg-black text-white">
      <ImportPdfHeader setIsSideMenuOpen={setIsSideMenuOpen} />

      <div className="flex grow flex-col justify-center gap-2">
        <PictureAsPdfIcon width={120} height={120} />
        <button className="rounded-lg bg-blue-900 px-4 py-2 text-white transition hover:brightness-110">
          Import PDF
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

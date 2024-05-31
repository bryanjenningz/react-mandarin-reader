import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Mandarin Reader",
  description:
    "A Mandarin Chinese PDF, subtitle, and clipboard text reader with a popup dictionary and built-in spaced-repetition flashcards.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  manifest: "/app.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}

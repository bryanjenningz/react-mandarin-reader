import { type BoxSize } from "~/app/_stores/state";
import { charHeight, charWidth } from "./constants";

export const getReaderInfo = (
  readerSize: BoxSize,
): { charsPerLine: number; linesPerPage: number; charsPerPage: number } => {
  const charsPerLine = Math.floor(readerSize.width / charWidth);
  const linesPerPage = Math.floor(readerSize.height / charHeight);
  const charsPerPage = linesPerPage * charsPerLine;
  return { charsPerLine, linesPerPage, charsPerPage };
};

export const getPageCount = (
  readerText: string,
  readerSize: BoxSize,
): number => {
  const { charsPerPage } = getReaderInfo(readerSize);
  return Math.ceil(readerText.length / charsPerPage);
};

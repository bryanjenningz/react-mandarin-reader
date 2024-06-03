import { type BoxSize } from "~/app/_stores/state";
import { getReaderInfo } from "./get-reader-info";

export const getPageCount = (
  readerText: string,
  readerSize: BoxSize,
): number => {
  const { charsPerPage } = getReaderInfo(readerSize);
  return Math.max(1, Math.ceil(readerText.length / charsPerPage));
};

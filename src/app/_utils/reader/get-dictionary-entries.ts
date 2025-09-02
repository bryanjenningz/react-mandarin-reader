import {
  type Reader,
  type ActiveReader,
  type BoxSize,
} from "~/app/_stores/state";
import {
  type Dictionary,
  type DictionaryEntry,
  lookupManyWithVariants,
} from "../dictionary";
import { getReaderInfo } from "./get-reader-info";

const getPageText = (reader: Reader, readerSize: BoxSize): string => {
  const { charsPerPage } = getReaderInfo(readerSize);
  const pageText = reader.text.slice(
    reader.pageIndex * charsPerPage,
    (reader.pageIndex + 1) * charsPerPage,
  );
  return pageText;
};

const getSelectedText = (reader: ActiveReader, readerSize: BoxSize): string => {
  const maxSelectedTextLength = 12;
  const pageText = getPageText(reader, readerSize);
  const selectedText =
    typeof reader.selection === "number"
      ? pageText.slice(
          reader.selection,
          reader.selection + maxSelectedTextLength,
        )
      : "";
  return selectedText;
};

export const getDictionaryEntries = (
  reader: ActiveReader,
  readerSize: BoxSize,
  dictionary: Dictionary,
): DictionaryEntry[] => {
  const selectedText = getSelectedText(reader, readerSize);
  const dictionaryEntries = lookupManyWithVariants(dictionary, selectedText);
  return dictionaryEntries;
};

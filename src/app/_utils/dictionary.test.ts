import { describe, expect, it } from "vitest";
import {
  type Dictionary,
  lookupLongest,
  type DictionaryEntry,
  loadDictionary,
} from "./dictionary";
import fs from "fs/promises";
import { resolve } from "path";

const mockFetch: typeof globalThis.fetch = async () => {
  const text = (
    await fs.readFile(resolve("./public/dictionary.txt"))
  ).toString();
  return {
    text: async () => text,
  } as unknown as ReturnType<typeof fetch>;
};

const dictionary: Dictionary = await loadDictionary(mockFetch);

describe("lookupLongest", () => {
  it("looks up the longest dictionary entry that starts with the text", () => {
    const text = "誘導病患洗腎";
    const actual = lookupLongest(dictionary, text);
    const expected: DictionaryEntry = {
      meanings: [
        "to induce; to encourage; to provide guidance",
        "(medicine, chemistry) to induce",
      ],
      pinyin: "yòu dǎo",
      simplified: "诱导",
      traditional: "誘導",
    };
    expect(actual).toEqual(expected);
  });

  it("works even if there are spaces/newlines/tabs in the middle of a word", () => {
    const text = "誘 \n\t 導病患洗腎";
    const actual = lookupLongest(dictionary, text);
    const expected: DictionaryEntry = {
      meanings: [
        "to induce; to encourage; to provide guidance",
        "(medicine, chemistry) to induce",
      ],
      pinyin: "yòu dǎo",
      simplified: "诱导",
      traditional: "誘導",
    };
    expect(actual).toEqual(expected);
  });
});

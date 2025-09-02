import { describe, expect, it } from "vitest";
import {
  type Dictionary,
  lookupLongest,
  type DictionaryEntry,
  loadDictionary,
  lookupMany,
  getVariant,
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

describe("lookupMany", () => {
  it("looks up dictionary entries that starts with the text", () => {
    const text = "誘導病患洗腎";
    const actual = lookupMany(dictionary, text);
    const expected: DictionaryEntry[] = [
      {
        meanings: [
          "to induce; to encourage; to provide guidance",
          "(medicine, chemistry) to induce",
        ],
        pinyin: "yòu dǎo",
        simplified: "诱导",
        traditional: "誘導",
      },
      {
        meanings: ["(literary) to induce; to entice"],
        pinyin: "yòu",
        simplified: "诱",
        traditional: "誘",
      },
    ];
    expect(actual).toEqual(expected);
  });

  it("works even if there are spaces/newlines/tabs in the middle of a word", () => {
    const text = "誘 \n\t 導病患洗腎";
    const actual = lookupMany(dictionary, text);
    const expected: DictionaryEntry[] = [
      {
        meanings: [
          "to induce; to encourage; to provide guidance",
          "(medicine, chemistry) to induce",
        ],
        pinyin: "yòu dǎo",
        simplified: "诱导",
        traditional: "誘導",
      },
      {
        meanings: ["(literary) to induce; to entice"],
        pinyin: "yòu",
        simplified: "诱",
        traditional: "誘",
      },
    ];
    expect(actual).toEqual(expected);
  });

  it("looks up 狼頭 which has definition 'variant of 榔頭|榔头'", () => {
    const text = "狼頭";
    const actual = lookupMany(dictionary, text);
    const expected: DictionaryEntry[] = [
      {
        meanings: ["variant of 榔頭|榔头[láng tou]"],
        pinyin: "láng tou",
        simplified: "狼头",
        traditional: "狼頭",
      },
      {
        meanings: ["wolf", "CL:匹[pǐ],隻|只[zhī],條|条[tiáo]"],
        pinyin: "láng",
        simplified: "狼",
        traditional: "狼",
      },
    ];
    expect(actual).toEqual(expected);
  });
});

describe("getVariant", () => {
  it("gets the variant of a dictionary entry", () => {
    const entry: DictionaryEntry = {
      meanings: ["variant of 榔頭|榔头[láng tou]"],
      pinyin: "láng tou",
      simplified: "狼头",
      traditional: "狼頭",
    };
    const actual = getVariant(entry);
    const expected = "榔頭";
    expect(actual).toEqual(expected);
  });

  it("returns null if there isn't a variant", () => {
    const entry: DictionaryEntry = {
      meanings: ["wolf", "CL:匹[pǐ],隻|只[zhī],條|条[tiáo]"],
      pinyin: "láng",
      simplified: "狼",
      traditional: "狼",
    };
    const actual = getVariant(entry);
    const expected = null;
    expect(actual).toEqual(expected);
  });
});

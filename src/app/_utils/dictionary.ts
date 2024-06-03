export type Dictionary = {
  traditional: string[];
  simplified: string[];
};

export type DictionaryEntry = {
  traditional: string;
  simplified: string;
  pinyin: string;
  meanings: string[];
};

export const loadDictionary = async (
  fetch: typeof globalThis.fetch = globalThis.fetch,
): Promise<Dictionary> => {
  const response = await fetch("/dictionary.txt");
  const dictionaryText = await response.text();
  const traditional = dictionaryText.split("\n");
  const simplified = traditional.slice().sort((lineA, lineB) => {
    const simplifiedA = lineToDictionaryEntry(lineA)?.simplified ?? "";
    const simplifiedB = lineToDictionaryEntry(lineB)?.simplified ?? "";
    if (simplifiedA < simplifiedB) return -1;
    if (simplifiedA > simplifiedB) return 1;
    return 0;
  });
  return { traditional, simplified };
};

const linePattern =
  /^(?<traditional>[^ ]+) (?<simplified>[^ ]+) \[(?<pinyin>[^\]]+)\] \/(?<meanings>.+)\/$/;

const lineToDictionaryEntry = (line: string): DictionaryEntry | null => {
  const { traditional, simplified, pinyin, meanings } =
    line.match(linePattern)?.groups ?? {};
  if (!traditional || !simplified || !pinyin || !meanings) return null;
  return { traditional, simplified, pinyin, meanings: meanings.split("/") };
};

export const lookupLongest = (
  dictionary: Dictionary,
  text: string,
): DictionaryEntry | null => {
  text = text.replace(/\s/g, "");
  while (text.length > 0) {
    const entry =
      lookup(dictionary, text, false) ?? lookup(dictionary, text, true);
    if (entry) return entry;
    text = text.slice(0, -1);
  }
  return null;
};

const lookup = (
  dictionary: Dictionary,
  text: string,
  isSimplified: boolean,
): DictionaryEntry | null => {
  let low = 0;
  let high = dictionary.traditional.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const line = isSimplified
      ? dictionary.simplified[mid]
      : dictionary.traditional[mid];
    if (!line) return null;
    const entry = lineToDictionaryEntry(line);
    if (!entry) return null;
    const word = isSimplified ? entry.simplified : entry.traditional;
    if (text === word) return entry;
    if (text < word) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return null;
};

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

export const loadDictionary = async (): Promise<Dictionary> => {
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

import { create } from "zustand";
import { loadDictionary, type Dictionary } from "../_utils/dictionary";

type DictionaryStore = {
  dictionary: Dictionary;
  loadDictionary: () => void;
};

export const useDictionaryStore = create<DictionaryStore>()((set) => ({
  dictionary: { traditional: [], simplified: [] },
  loadDictionary: () => {
    void (async () => {
      const dictionary = await loadDictionary();
      set({ dictionary });
    })();
  },
}));

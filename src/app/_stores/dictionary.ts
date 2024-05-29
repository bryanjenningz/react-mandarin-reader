import { create } from "zustand";
import { loadDictionary, type Dictionary } from "../_utils/dictionary";

type DictionaryStore = {
  dictionary: Dictionary;
  loadDictionary: () => void;
};

export const useDictionaryStore = create<DictionaryStore>()((set, get) => ({
  dictionary: { traditional: [], simplified: [] },
  loadDictionary: () => {
    if (get().dictionary.traditional.length > 0) return;
    void (async () => {
      const dictionary = await loadDictionary();
      set({ dictionary });
    })();
  },
}));

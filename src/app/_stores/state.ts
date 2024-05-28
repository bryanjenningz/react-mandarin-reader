import { create } from "zustand";
import { persist } from "zustand/middleware";
import { charsPerPage } from "../_components/reader-text";
import { type DictionaryEntry } from "../_utils/dictionary";

type State = {
  reader: Reader;
  readerHistory: Reader[];
  flashcards: Flashcard[];
  settings: SettingsOptions;
};

type Reader = {
  text: string;
  date: number;
  pageIndex: number;
};

type Flashcard = {
  entry: DictionaryEntry;
  correct: number;
};

export type SettingsOptions = {
  playAudioOnWordLookup: SettingsOption;
};

export type SettingsOption = {
  name: string;
  description: string;
  enabled: boolean;
};

type Action =
  | { type: "PASTE_READER_TEXT"; text: string; date: number }
  | { type: "SET_READER_TEXT"; text: string; date: number; pageIndex: number }
  | { type: "INCREMENT_PAGE_INDEX" }
  | { type: "DECREMENT_PAGE_INDEX" }
  | { type: "ADD_OR_REMOVE_FLASHCARD"; entry: DictionaryEntry }
  | { type: "TOGGLE_SETTINGS_OPTION"; name: keyof SettingsOptions };

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

export const reducer = (state: State, action: Action): [State, () => void] => {
  switch (action.type) {
    case "PASTE_READER_TEXT": {
      const reader: Reader = {
        text: action.text,
        date: action.date,
        pageIndex: 0,
      };
      const readerHistory: Reader[] = [reader, ...state.readerHistory];
      return [{ ...state, reader, readerHistory }, noop];
    }
    case "SET_READER_TEXT": {
      const reader: Reader = {
        text: action.text,
        date: action.date,
        pageIndex: action.pageIndex,
      };
      return [{ ...state, reader }, noop];
    }
    case "INCREMENT_PAGE_INDEX": {
      const pageCount = Math.ceil(state.reader.text.length / charsPerPage);
      const pageIndex = Math.min(
        Math.max(0, pageCount - 1),
        state.reader.pageIndex + 1,
      );
      const readerHistory = state.readerHistory.map((reader) => {
        if (reader.date !== state.reader.date) return reader;
        return { ...reader, pageIndex };
      });
      return [
        { ...state, reader: { ...state.reader, pageIndex }, readerHistory },
        noop,
      ];
    }
    case "DECREMENT_PAGE_INDEX": {
      const pageIndex = Math.max(0, state.reader.pageIndex - 1);
      const readerHistory = state.readerHistory.map((reader) => {
        if (reader.date !== state.reader.date) return reader;
        return { ...reader, pageIndex };
      });
      return [
        { ...state, reader: { ...state.reader, pageIndex }, readerHistory },
        noop,
      ];
    }
    case "ADD_OR_REMOVE_FLASHCARD": {
      const containsFlashcard = !!state.flashcards.find(
        (card) => card.entry.traditional === action.entry.traditional,
      );
      if (containsFlashcard) {
        const flashcards = state.flashcards.filter(
          (card) => card.entry.traditional !== action.entry.traditional,
        );
        return [{ ...state, flashcards }, noop];
      }
      const flashcards: Flashcard[] = [
        ...state.flashcards,
        { entry: action.entry, correct: 0 },
      ];
      return [{ ...state, flashcards }, noop];
    }
    case "TOGGLE_SETTINGS_OPTION": {
      const settings: SettingsOptions = {
        ...state.settings,
        [action.name]: {
          ...state.settings[action.name],
          enabled: !state.settings[action.name].enabled,
        },
      };
      return [{ ...state, settings }, noop];
    }
  }
};

export type Dispatch = (action: Action) => void;

type StateStore = State & { dispatch: Dispatch };

export const useStateStore = create<StateStore>()(
  persist(
    (set) => ({
      reader: { text: "", date: 0, pageIndex: 0 },
      readerHistory: [],
      flashcards: [],
      settings: {
        playAudioOnWordLookup: {
          name: "Play audio on word lookup",
          description:
            "Autoplay the pronunciation audio on each word lookup in the reader.",
          enabled: true,
        },
        playAudioOnFlashcardBack: {
          name: "Play audio on flashcard back",
          description:
            "Autoplay the pronunciation audio on the back of each flashcard while you're reviewing.",
          enabled: true,
        },
      },
      dispatch: (action: Action): void =>
        set((state) => {
          const [newState, sideEffect] = reducer(state, action);
          setTimeout(() => sideEffect(), 1);
          return newState;
        }),
    }),
    { name: "state" },
  ),
);

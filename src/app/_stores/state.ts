import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type DictionaryEntry } from "../_utils/dictionary";
import { getPageCount } from "../_utils/reader/get-page-count";

export type State = {
  readerSize: BoxSize;
  reader: ActiveReader;
  readerHistory: Reader[];
  flashcards: Flashcard[];
  settings: SettingsOptions;
};

export type BoxSize = {
  width: number;
  height: number;
};

export type ActiveReader = Reader & { selection: number | null };

export type Reader = {
  text: string;
  date: number;
  pageIndex: number;
};

export type Flashcard = {
  entry: DictionaryEntry;
  correct: number;
};

export type SettingsOptions = {
  playAudioOnWordLookup: SettingsOption;
  playAudioOnFlashcardBack: SettingsOption;
};

export type SettingsOption = {
  name: string;
  description: string;
  enabled: boolean;
};

export type Action =
  | { type: "SET_READER_SIZE"; width: number; height: number }
  | { type: "PASTE_READER_TEXT"; text: string; date: number }
  | { type: "SET_READER_TEXT"; text: string; date: number; pageIndex: number }
  | { type: "DELETE_READER_HISTORY_ITEM"; date: number }
  | { type: "SET_READER_SELECTION"; selection: number }
  | { type: "INCREMENT_PAGE_INDEX" }
  | { type: "DECREMENT_PAGE_INDEX" }
  | { type: "ADD_OR_REMOVE_FLASHCARD"; entry: DictionaryEntry }
  | { type: "PASS_FLASHCARD" }
  | { type: "FAIL_FLASHCARD" }
  | { type: "TOGGLE_SETTINGS_OPTION"; name: keyof SettingsOptions };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_READER_SIZE": {
      const readerSize: BoxSize = {
        width: action.width,
        height: action.height,
      };
      return { ...state, readerSize };
    }
    case "PASTE_READER_TEXT": {
      const reader: ActiveReader = {
        text: action.text,
        date: action.date,
        pageIndex: 0,
        selection: null,
      };
      const readerHistory: Reader[] = [reader, ...state.readerHistory];
      return { ...state, reader, readerHistory };
    }
    case "SET_READER_TEXT": {
      const reader: ActiveReader = {
        text: action.text,
        date: action.date,
        pageIndex: action.pageIndex,
        selection: null,
      };
      return { ...state, reader };
    }
    case "DELETE_READER_HISTORY_ITEM": {
      const readerHistory: Reader[] = state.readerHistory.filter(
        (x) => x.date !== action.date,
      );
      return { ...state, readerHistory };
    }
    case "SET_READER_SELECTION": {
      const reader: ActiveReader = {
        ...state.reader,
        selection: action.selection,
      };
      return { ...state, reader };
    }
    case "INCREMENT_PAGE_INDEX": {
      const pageCount = getPageCount(state.reader.text, state.readerSize);
      const pageIndex = Math.min(
        Math.max(0, pageCount - 1),
        state.reader.pageIndex + 1,
      );
      const reader: ActiveReader = {
        ...state.reader,
        pageIndex,
        selection: null,
      };
      const readerHistory = state.readerHistory.map((reader) => {
        if (reader.date !== state.reader.date) return reader;
        return { ...reader, pageIndex };
      });
      return { ...state, reader, readerHistory };
    }
    case "DECREMENT_PAGE_INDEX": {
      const pageIndex = Math.max(0, state.reader.pageIndex - 1);
      const reader: ActiveReader = {
        ...state.reader,
        pageIndex,
        selection: null,
      };
      const readerHistory = state.readerHistory.map((reader) => {
        if (reader.date !== state.reader.date) return reader;
        return { ...reader, pageIndex };
      });
      return { ...state, reader, readerHistory };
    }
    case "ADD_OR_REMOVE_FLASHCARD": {
      const containsFlashcard = !!state.flashcards.find(
        (card) => card.entry.traditional === action.entry.traditional,
      );
      if (containsFlashcard) {
        const flashcards = state.flashcards.filter(
          (card) => card.entry.traditional !== action.entry.traditional,
        );
        return { ...state, flashcards };
      }
      const flashcards: Flashcard[] = [
        ...state.flashcards,
        { entry: action.entry, correct: 0 },
      ];
      return { ...state, flashcards };
    }
    case "PASS_FLASHCARD": {
      const flashcard = state.flashcards[0];
      if (!flashcard) return state;
      const newFlashcard: Flashcard = {
        ...flashcard,
        correct: flashcard.correct + 1,
      };
      const intervalScalar = 5;
      const index = newFlashcard.correct * intervalScalar;
      const remainingFlashcards = state.flashcards.slice(1);
      const flashcards: Flashcard[] = [
        ...remainingFlashcards.slice(0, index),
        newFlashcard,
        ...remainingFlashcards.slice(index),
      ];
      return { ...state, flashcards };
    }
    case "FAIL_FLASHCARD": {
      const flashcard = state.flashcards[0];
      if (!flashcard) return state;
      const newFlashcard: Flashcard = { ...flashcard, correct: 0 };
      const index = 2;
      const remainingFlashcards = state.flashcards.slice(1);
      const flashcards: Flashcard[] = [
        ...remainingFlashcards.slice(0, index),
        newFlashcard,
        ...remainingFlashcards.slice(index),
      ];
      return { ...state, flashcards };
    }
    case "TOGGLE_SETTINGS_OPTION": {
      const settings: SettingsOptions = {
        ...state.settings,
        [action.name]: {
          ...state.settings[action.name],
          enabled: !state.settings[action.name].enabled,
        },
      };
      return { ...state, settings };
    }
  }
};

export type Dispatch = (action: Action) => void;

type StateStore = State & { dispatch: Dispatch };

export const useStateStore = create<StateStore>()(
  persist(
    (set) => ({
      readerSize: { width: 390, height: 600 },
      reader: { text: "", date: 0, pageIndex: 0, selection: null },
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
        set((state) => reducer(state, action)),
    }),
    { name: "state" },
  ),
);

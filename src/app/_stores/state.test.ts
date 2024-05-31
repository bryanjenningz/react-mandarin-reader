import { describe, it, expect } from "vitest";
import { type State, reducer, type Action, type Flashcard } from "./state";
import { type DictionaryEntry } from "../_utils/dictionary";

const state: State = {
  isMenuOpen: false,
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
};

describe("reducer", () => {
  describe("OPEN_MENU", () => {
    it("opens the menu", () => {
      const initState: State = { ...state, isMenuOpen: false };
      const action: Action = { type: "OPEN_MENU" };
      const actual = reducer(initState, action);
      const expected: State = { ...initState, isMenuOpen: true };
      expect(actual).toEqual(expected);
    });
  });

  describe("CLOSE_MENU", () => {
    it("opens the menu", () => {
      const initState: State = { ...state, isMenuOpen: true };
      const action: Action = { type: "CLOSE_MENU" };
      const actual = reducer(initState, action);
      const expected: State = { ...initState, isMenuOpen: false };
      expect(actual).toEqual(expected);
    });
  });

  describe("SET_READER_SIZE", () => {
    it("sets the reader size", () => {
      const initState: State = {
        ...state,
        readerSize: { width: 0, height: 0 },
      };
      const action: Action = { type: "SET_READER_SIZE", width: 1, height: 2 };
      const actual = reducer(initState, action);
      const expected: State = { ...state, readerSize: { width: 1, height: 2 } };
      expect(actual).toEqual(expected);
    });
  });

  describe("PASTE_READER_TEXT", () => {
    it("pastes new reader text", () => {
      const initState: State = {
        ...state,
        reader: { text: "before text", date: 1, pageIndex: 2, selection: 3 },
        readerHistory: [{ text: "before text", date: 1, pageIndex: 2 }],
      };
      const action: Action = {
        type: "PASTE_READER_TEXT",
        text: "new text",
        date: 123,
      };
      const actual = reducer(initState, action);
      const expected: State = {
        ...state,
        reader: { text: "new text", date: 123, pageIndex: 0, selection: null },
        readerHistory: [
          { date: 123, pageIndex: 0, text: "new text" },
          { date: 1, pageIndex: 2, text: "before text" },
        ],
      };
      expect(actual).toEqual(expected);
    });
  });

  describe("SET_READER_TEXT", () => {
    it("sets the reader text", () => {
      const initState: State = {
        ...state,
        reader: { text: "before text", date: 1, pageIndex: 2, selection: 3 },
      };
      const action: Action = {
        type: "SET_READER_TEXT",
        text: "new text",
        date: 123,
        pageIndex: 5,
      };
      const actual = reducer(initState, action);
      const expected: State = {
        ...state,
        reader: { text: "new text", date: 123, pageIndex: 5, selection: null },
      };
      expect(actual).toEqual(expected);
    });
  });

  describe("DELETE_READER_HISTORY_ITEM", () => {
    it("deletes the reader history item", () => {
      const initState: State = {
        ...state,
        readerHistory: [
          { date: 123, pageIndex: 0, text: "new text" },
          { date: 1, pageIndex: 2, text: "before text" },
        ],
      };
      const action: Action = { type: "DELETE_READER_HISTORY_ITEM", date: 123 };
      const actual = reducer(initState, action);
      const expected: State = {
        ...state,
        readerHistory: [{ date: 1, pageIndex: 2, text: "before text" }],
      };
      expect(actual).toEqual(expected);
    });
  });

  describe("SET_READER_SELECTION", () => {
    it("sets the reader selection", () => {
      const initState: State = {
        ...state,
        reader: { text: "a", date: 1, pageIndex: 2, selection: 3 },
      };
      const action: Action = { type: "SET_READER_SELECTION", selection: 5 };
      const actual = reducer(initState, action);
      const expected: State = {
        ...state,
        reader: { ...initState.reader, selection: 5 },
      };
      expect(actual).toEqual(expected);
    });
  });

  describe("INCREMENT_PAGE_INDEX", () => {
    it("increments the reader page index", () => {
      const initState: State = {
        ...state,
        reader: { text: "a".repeat(1000), date: 1, pageIndex: 0, selection: 3 },
      };
      const action: Action = { type: "INCREMENT_PAGE_INDEX" };
      const actual = reducer(initState, action);
      const expected: State = {
        ...state,
        reader: { ...initState.reader, pageIndex: 1, selection: null },
      };
      expect(actual).toEqual(expected);
    });

    it("only closes the selection if the reader page index is already the maximum page index", () => {
      const initState: State = {
        ...state,
        reader: { text: "a", date: 1, pageIndex: 0, selection: 3 },
      };
      const action: Action = { type: "INCREMENT_PAGE_INDEX" };
      const actual = reducer(initState, action);
      const expected: State = {
        ...initState,
        reader: { ...initState.reader, selection: null },
      };
      expect(actual).toEqual(expected);
    });
  });

  describe("DECREMENT_PAGE_INDEX", () => {
    it("decrements the reader page index", () => {
      const initState: State = {
        ...state,
        reader: { text: "a".repeat(1000), date: 1, pageIndex: 1, selection: 3 },
      };
      const action: Action = { type: "DECREMENT_PAGE_INDEX" };
      const actual = reducer(initState, action);
      const expected: State = {
        ...state,
        reader: { ...initState.reader, pageIndex: 0, selection: null },
      };
      expect(actual).toEqual(expected);
    });

    it("only closes the selection if the reader page index is already 0", () => {
      const initState: State = {
        ...state,
        reader: { text: "a".repeat(1000), date: 1, pageIndex: 0, selection: 3 },
      };
      const action: Action = { type: "DECREMENT_PAGE_INDEX" };
      const actual = reducer(initState, action);
      const expected: State = {
        ...initState,
        reader: { ...initState.reader, selection: null },
      };
      expect(actual).toEqual(expected);
    });
  });

  describe("ADD_OR_REMOVE_FLASHCARD", () => {
    it("adds a flashcard to the end if it isn't already added", () => {
      const flashcard: Flashcard = {
        entry: {
          traditional: "t",
          simplified: "s",
          pinyin: "p",
          meanings: ["m"],
        },
        correct: 1,
      };
      const entry: DictionaryEntry = {
        traditional: "t2",
        simplified: "s2",
        pinyin: "p2",
        meanings: ["m2"],
      };
      const initState: State = {
        ...state,
        flashcards: [flashcard],
      };
      const action: Action = { type: "ADD_OR_REMOVE_FLASHCARD", entry };
      const actual = reducer(initState, action);
      const expected: State = {
        ...initState,
        flashcards: [...initState.flashcards, { entry, correct: 0 }],
      };
      expect(actual).toEqual(expected);
    });

    it("removes a flashcard if it's already added", () => {
      const flashcard: Flashcard = {
        entry: {
          traditional: "t",
          simplified: "s",
          pinyin: "p",
          meanings: ["m"],
        },
        correct: 1,
      };
      const entry: DictionaryEntry = {
        traditional: "t",
        simplified: "s",
        pinyin: "p",
        meanings: ["m"],
      };
      const initState: State = {
        ...state,
        flashcards: [flashcard],
      };
      const action: Action = { type: "ADD_OR_REMOVE_FLASHCARD", entry };
      const actual = reducer(initState, action);
      const expected: State = {
        ...initState,
        flashcards: [],
      };
      expect(actual).toEqual(expected);
    });
  });

  describe("PASS_FLASHCARD", () => {
    it("passes the first flashcard", () => {
      const flashcard: Flashcard = {
        entry: {
          traditional: "t",
          simplified: "s",
          pinyin: "p",
          meanings: ["m"],
        },
        correct: 1,
      };
      const flashcard2: Flashcard = {
        entry: {
          traditional: "t2",
          simplified: "s2",
          pinyin: "p2",
          meanings: ["m2"],
        },
        correct: 0,
      };
      const initState: State = {
        ...state,
        flashcards: [flashcard, flashcard2],
      };
      const action: Action = { type: "PASS_FLASHCARD" };
      const actual = reducer(initState, action);
      const expected: State = {
        ...initState,
        flashcards: [flashcard2, { ...flashcard, correct: 2 }],
      };
      expect(actual).toEqual(expected);
    });
  });

  describe("FAIL_FLASHCARD", () => {
    it("passes the first flashcard", () => {
      const flashcard: Flashcard = {
        entry: {
          traditional: "t",
          simplified: "s",
          pinyin: "p",
          meanings: ["m"],
        },
        correct: 1,
      };
      const flashcard2: Flashcard = {
        entry: {
          traditional: "t2",
          simplified: "s2",
          pinyin: "p2",
          meanings: ["m2"],
        },
        correct: 0,
      };
      const initState: State = {
        ...state,
        flashcards: [flashcard, flashcard2],
      };
      const action: Action = { type: "FAIL_FLASHCARD" };
      const actual = reducer(initState, action);
      const expected: State = {
        ...initState,
        flashcards: [flashcard2, { ...flashcard, correct: 0 }],
      };
      expect(actual).toEqual(expected);
    });
  });

  describe("TOGGLE_SETTINGS_OPTION", () => {
    it("toggles the playAudioOnWordLookup settings option you pass in", () => {
      const action: Action = {
        type: "TOGGLE_SETTINGS_OPTION",
        name: "playAudioOnWordLookup",
      };
      const actual = reducer(state, action);
      const expected: State = {
        ...state,
        settings: {
          ...state.settings,
          playAudioOnWordLookup: {
            ...state.settings.playAudioOnWordLookup,
            enabled: !state.settings.playAudioOnWordLookup.enabled,
          },
        },
      };
      expect(actual).toEqual(expected);
    });

    it("toggles the playAudioOnFlashcardBack settings option you pass in", () => {
      const action: Action = {
        type: "TOGGLE_SETTINGS_OPTION",
        name: "playAudioOnFlashcardBack",
      };
      const actual = reducer(state, action);
      const expected: State = {
        ...state,
        settings: {
          ...state.settings,
          playAudioOnFlashcardBack: {
            ...state.settings.playAudioOnFlashcardBack,
            enabled: !state.settings.playAudioOnFlashcardBack.enabled,
          },
        },
      };
      expect(actual).toEqual(expected);
    });
  });
});

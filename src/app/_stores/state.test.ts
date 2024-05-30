import { describe, it, expect } from "vitest";
import { type State, reducer, type Action } from "./state";

const state: State = {
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
  it("sets the reader size", () => {
    const initState: State = { ...state, readerSize: { width: 0, height: 0 } };
    const action: Action = { type: "SET_READER_SIZE", width: 1, height: 2 };
    const actual = reducer(initState, action);
    const expected: State = { ...state, readerSize: { width: 1, height: 2 } };
    expect(actual).toEqual(expected);
  });

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

  it("sets the reader selection", () => {
    const initState: State = {
      ...state,
      reader: { text: "a", date: 1, pageIndex: 2, selection: 3 },
    };
    const action: Action = { type: "SET_READER_SELECTION", selection: 5 };
    const actual = reducer(initState, action);
    const expected: State = {
      ...state,
      reader: { text: "a", date: 1, pageIndex: 2, selection: 5 },
    };
    expect(actual).toEqual(expected);
  });

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
});

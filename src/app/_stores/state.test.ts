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
});

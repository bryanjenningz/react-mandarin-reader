import { create } from "zustand";
import { persist } from "zustand/middleware";
import { charsPerPage } from "../_components/reader-text";

type State = {
  reader: Reader;
  readerHistory: Reader[];
};

type Reader = {
  text: string;
  date: number;
  pageIndex: number;
};

type Action =
  | { type: "PASTE_READER_TEXT"; text: string; date: number }
  | { type: "SET_READER_TEXT"; text: string; date: number; pageIndex: number }
  | { type: "INCREMENT_PAGE_INDEX" }
  | { type: "DECREMENT_PAGE_INDEX" };

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
  }
};

type Dispatch = (action: Action) => void;

type StateStore = State & { dispatch: Dispatch };

export const useStateStore = create<StateStore>()(
  persist(
    (set) => ({
      reader: { text: "", date: 0, pageIndex: 0 },
      readerHistory: [],
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

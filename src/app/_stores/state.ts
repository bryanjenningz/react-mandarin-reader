import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  reader: Reader;
  readerHistory: Reader[];
};

type Reader = {
  text: string;
  date: number;
};

type Action =
  | { type: "PASTE_READER_TEXT"; text: string; date: number }
  | { type: "SET_READER_TEXT"; text: string; date: number };

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

export const reducer = (state: State, action: Action): [State, () => void] => {
  switch (action.type) {
    case "PASTE_READER_TEXT": {
      const reader: Reader = { text: action.text, date: action.date };
      const readerHistory: Reader[] = [reader, ...state.readerHistory];
      return [{ ...state, reader, readerHistory }, noop];
    }
    case "SET_READER_TEXT": {
      const reader: Reader = { text: action.text, date: action.date };
      return [{ ...state, reader }, noop];
    }
  }
};

type Dispatch = (action: Action) => void;

type StateStore = State & { dispatch: Dispatch };

export const useStateStore = create<StateStore>()(
  persist(
    (set) => ({
      reader: { text: "", date: 0 },
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

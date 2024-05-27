import { create } from "zustand";

type State = {
  readerText: string;
  readerHistory: ReaderHistoryItem[];
};

type ReaderHistoryItem = {
  text: string;
  date: number;
};

type Action = { type: "PASTE_READER_TEXT"; text: string; date: number };

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

export const reducer = (state: State, action: Action): [State, () => void] => {
  switch (action.type) {
    case "PASTE_READER_TEXT": {
      const readerText = action.text;
      const readerHistory = [
        { text: action.text, date: action.date },
        ...state.readerHistory,
      ];
      return [{ ...state, readerText, readerHistory }, noop];
    }
  }
};

type Dispatch = (action: Action) => void;

type StateStore = State & { dispatch: Dispatch };

export const useStateStore = create<StateStore>()((set) => ({
  readerText: "",
  readerHistory: [],
  dispatch: (action: Action): void =>
    set((state) => {
      const [newState, sideEffect] = reducer(state, action);
      setTimeout(() => sideEffect(), 1);
      return newState;
    }),
}));

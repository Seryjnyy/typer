import { create } from "zustand";
import zustymiddlewarets from "zustymiddlewarets";

import { createSelectors } from "./create-selectors";

type State = {
    songTotalChar: number;
    songTypedChar: number;
    completed: boolean;
    started: boolean;
    timeElapsed: number;
    correct: number;
    incorrect: number;
    userInput: string;
    errorMap: Map<number, number>;
};
interface Actions {
    setSongTotalChar: (charCount: number) => void;
    setSongTypedChar: (charCount: number) => void;
    setCompleted: (completed: boolean) => void;
    setStarted: (started: boolean) => void;
    setTimeElapsed: (timeElapsed: number) => void;
    setCorrect: (value: number) => void;
    setIncorrect: (value: number) => void;
    setUserInput: (value: string) => void;
    resetState: () => void;
    recordError: (index: number) => void;
}

const defaults: State = {
    songTotalChar: 0,
    songTypedChar: 0,
    completed: false,
    started: false,
    timeElapsed: 0,
    correct: 0,
    incorrect: 0,
    userInput: "",
    errorMap: new Map<number, number>(),
};

const useSongProgressStoreBase = create<State & Actions>(
    zustymiddlewarets((set) => ({
        ...defaults,
        setSongTotalChar: (charCount) =>
            set(() => ({ songTotalChar: charCount })),
        setSongTypedChar: (charCount) =>
            set(() => ({ songTypedChar: charCount })),
        setCompleted: (completed) => set(() => ({ completed: completed })),
        setTimeElapsed: (timeElapsed) =>
            set(() => ({ timeElapsed: timeElapsed })),
        setStarted: (started) => set(() => ({ started: started })),
        setCorrect: (value) => set(() => ({ correct: value })),
        setIncorrect: (value) => set(() => ({ incorrect: value })),
        setUserInput: (value) =>
            set(() => {
                return { userInput: value };
            }),
        resetState: () => set(() => defaults),
        recordError: (index) =>
            set((state) => {
                const newMap = new Map<number, number>(state.errorMap);

                newMap.set(index, (newMap.get(index) ?? 0) + 1);
                return { errorMap: newMap };
            }),
    }))
);

const useSongProgressStore = createSelectors(useSongProgressStoreBase);

// TODO : why is this here???? what is it????
// declare global {
//     interface Window {
//         store: typeof useSongProgressStore;
//     }
// }

// window.store = useSongProgressStore;

export { useSongProgressStore };

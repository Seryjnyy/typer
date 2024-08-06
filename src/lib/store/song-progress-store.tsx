import { create } from "zustand";
import zustymiddlewarets from "zustymiddlewarets";

import { createSelectors } from "./create-selectors";

type Store = {
    songTotalChar: number;
    setSongTotalChar: (charCount: number) => void;
    songTypedChar: number;
    setSongTypedChar: (charCount: number) => void;
    completed: boolean;
    setCompleted: (completed: boolean) => void;
    started: boolean;
    setStarted: (started: boolean) => void;
    timeElapsed: number;
    setTimeElapsed: (timeElapsed: number) => void;
};

const useSongProgressStoreBase = create<Store>(
    zustymiddlewarets((set) => ({
        songTotalChar: 0,
        setSongTotalChar: (charCount) =>
            set(() => ({ songTotalChar: charCount })),
        songTypedChar: 0,
        setSongTypedChar: (charCount) =>
            set(() => ({ songTypedChar: charCount })),
        completed: false,
        setCompleted: (completed) => set(() => ({ completed: completed })),
        timeElapsed: 0,
        setTimeElapsed: (timeElapsed) =>
            set(() => ({ timeElapsed: timeElapsed })),
        started: false,
        setStarted: (started) => set(() => ({ started: started })),
    }))
);

const useSongProgressStore = createSelectors(useSongProgressStoreBase);

declare global {
    interface Window {
        store: typeof useSongProgressStore;
    }
}

window.store = useSongProgressStore;

export { useSongProgressStore };

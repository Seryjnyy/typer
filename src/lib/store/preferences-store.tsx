import { create } from "zustand";

import { Windows } from "../types";
import { createSelectors } from "./create-selectors";
import { persist, createJSONStorage } from "zustand/middleware";

export type TyperTextDisplay = "cylinder" | "flat";
export type QueueStorage = "localStorage" | "sessionStorage";

// const PreferenceStoreName = "typer-preferences-storage";

type State = {
    typerTextDisplay: TyperTextDisplay;
    verseTyperTextDisplay: TyperTextDisplay;
    queueStorage: QueueStorage;
    isCompletionAnim: boolean;
    isQueueColour: boolean;
};

type Actions = {
    setTyperTextDisplay: (val: TyperTextDisplay) => void;
    setVerseTyperTextDisplay: (val: TyperTextDisplay) => void;
    setQueueStorage: (val: QueueStorage) => void;
    setCompletionAnim: (val: boolean) => void;
    setQueueColour: (val: boolean) => void;
};

const defaults: State = {
    typerTextDisplay: "cylinder",
    verseTyperTextDisplay: "flat",
    queueStorage: "localStorage",
    isCompletionAnim: true,
    isQueueColour: true,
};

const usePreferenceStoreBase = create<State & Actions>()(
    persist(
        (set, get) => ({
            ...defaults,
            setTyperTextDisplay: (val: TyperTextDisplay) =>
                set(() => {
                    return { typerTextDisplay: val };
                }),
            setVerseTyperTextDisplay: (val: TyperTextDisplay) =>
                set(() => {
                    return { verseTyperTextDisplay: val };
                }),
            setQueueStorage: (val: QueueStorage) =>
                set(() => {
                    return { queueStorage: val };
                }),
            setCompletionAnim: (val: boolean) =>
                set(() => {
                    return { isCompletionAnim: val };
                }),
            setQueueColour: (val: boolean) =>
                set(() => {
                    return { isQueueColour: val };
                }),
        }),
        {
            name: "typer-preferences-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

const usePreferenceStore = createSelectors(usePreferenceStoreBase);

export { usePreferenceStore };

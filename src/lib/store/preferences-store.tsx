import { create } from "zustand";

import { Windows } from "../types";
import { createSelectors } from "./create-selectors";
import { persist, createJSONStorage } from "zustand/middleware";
import { ListStyle, Order, SortBy } from "@/routes/song/songs";

export type TyperTextDisplay = "cylinder" | "flat";
export type QueueStorage = "localStorage" | "sessionStorage";

// const PreferenceStoreName = "typer-preferences-storage";

type SongList = { listStyle: ListStyle; sortBy: SortBy; order: Order };

type State = {
    typerTextDisplay: TyperTextDisplay;
    verseTyperTextDisplay: TyperTextDisplay;
    queueStorage: QueueStorage;
    isCompletionAnim: boolean;
    isQueueColour: boolean;
    songList: SongList;
};

type Actions = {
    setTyperTextDisplay: (val: TyperTextDisplay) => void;
    setVerseTyperTextDisplay: (val: TyperTextDisplay) => void;
    setQueueStorage: (val: QueueStorage) => void;
    setCompletionAnim: (val: boolean) => void;
    setQueueColour: (val: boolean) => void;
    setSongListPref: (val: SongList) => void;
    resetPreferences: () => void;
};

const defaults: State = {
    typerTextDisplay: "cylinder",
    verseTyperTextDisplay: "flat",
    queueStorage: "localStorage",
    isCompletionAnim: true,
    isQueueColour: true,
    songList: { listStyle: "list", sortBy: "created", order: "asc" },
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
            setSongListPref: (val: SongList) =>
                set(() => {
                    return { songList: val };
                }),
            setQueueColour: (val: boolean) =>
                set(() => {
                    return { isQueueColour: val };
                }),
            resetPreferences: () =>
                set(() => {
                    return defaults;
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

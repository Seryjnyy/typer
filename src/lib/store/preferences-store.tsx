import { create } from "zustand";

import { ListStyle, Order, SortBy, Windows } from "../types";
import { createSelectors } from "./create-selectors";
import { persist, createJSONStorage } from "zustand/middleware";

export type TyperTextDisplay = "cylinder" | "flat";
export type QueueStorage = "localStorage" | "sessionStorage";

// const PreferenceStoreName = "typer-preferences-storage";

type SongList = { listStyle: ListStyle; sortBy: SortBy; order: Order };

type ExportSongs = {
    cover: boolean;
    completion: boolean;
    record: boolean;
    createdAt: boolean;
};

type ImportSongs = {
    cover: boolean;
    completion: boolean;
    record: boolean;
    createdAt: boolean;
};

type State = {
    typerTextDisplay: TyperTextDisplay;
    verseTyperTextDisplay: TyperTextDisplay;
    queueStorage: QueueStorage;
    isCompletionAnim: boolean;
    isErrorAnim: boolean;
    isCorrectAnim: boolean;
    isQueueColour: boolean;
    isOpenEndScreenInitially: boolean;
    isOpenEndScreenInitiallyVersePage: boolean;
    songList: SongList;
    exportSongs: ExportSongs;
    importSongs: ImportSongs;
};

type Actions = {
    setTyperTextDisplay: (val: TyperTextDisplay) => void;
    setVerseTyperTextDisplay: (val: TyperTextDisplay) => void;
    setQueueStorage: (val: QueueStorage) => void;
    setCompletionAnim: (val: boolean) => void;
    setErrorAnim: (val: boolean) => void;
    setCorrectAnim: (val: boolean) => void;
    setQueueColour: (val: boolean) => void;
    setSongListPref: (val: SongList) => void;
    setOpenEndScreenInitially: (val: boolean) => void;
    setOpenEndScreenInitiallyVersePage: (val: boolean) => void;
    setExportSongs: (val: ExportSongs) => void;
    setImportSongs: (val: ImportSongs) => void;
    resetPreferences: () => void;
    resetImportPref: () => void;
    resetExportPref: () => void;
};

const defaults: State = {
    typerTextDisplay: "cylinder",
    verseTyperTextDisplay: "flat",
    queueStorage: "localStorage",
    isCompletionAnim: true,
    isQueueColour: true,
    isErrorAnim: true,
    isCorrectAnim: true,
    songList: { listStyle: "list", sortBy: "created", order: "asc" },
    isOpenEndScreenInitially: true,
    isOpenEndScreenInitiallyVersePage: false,
    exportSongs: {
        cover: true,
        completion: false,
        record: false,
        createdAt: true,
    },
    importSongs: {
        cover: true,
        completion: false,
        createdAt: true,
        record: false,
    },
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
            setErrorAnim: (val: boolean) =>
                set(() => {
                    return { isErrorAnim: val };
                }),
            setCorrectAnim: (val: boolean) =>
                set(() => {
                    return { isCorrectAnim: val };
                }),
            setOpenEndScreenInitially: (val: boolean) =>
                set(() => {
                    return { isOpenEndScreenInitially: val };
                }),
            setOpenEndScreenInitiallyVersePage: (val: boolean) =>
                set(() => {
                    return { isOpenEndScreenInitiallyVersePage: val };
                }),
            setSongListPref: (val: SongList) =>
                set(() => {
                    return { songList: val };
                }),
            setQueueColour: (val: boolean) =>
                set(() => {
                    return { isQueueColour: val };
                }),
            setExportSongs: (val: ExportSongs) =>
                set(() => {
                    return { exportSongs: val };
                }),
            setImportSongs: (val: ImportSongs) =>
                set(() => {
                    return { importSongs: val };
                }),
            resetExportPref: () =>
                set(() => {
                    return { exportSongs: defaults.exportSongs };
                }),
            resetImportPref: () =>
                set(() => {
                    return { importSongs: defaults.importSongs };
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

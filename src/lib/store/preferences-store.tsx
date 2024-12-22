import { create } from "zustand"

import { ListStyle, Order, SortBy } from "../types"
import { createSelectors } from "./create-selectors"
import { createJSONStorage, persist } from "zustand/middleware"

export type TyperTextDisplay = "cylinder" | "flat"
export type QueueStorage = "localStorage" | "sessionStorage"

type SongList = { listStyle: ListStyle; sortBy: SortBy; order: Order }

export const songMandatoryExports = {
    title: true,
    source: true,
    content: true,
}

export const songMandatoryImports = {
    title: true,
    source: true,
    content: true,
}

export type SongExportPreferences = {
    cover: boolean
    completion: boolean
    record: boolean
    createdAt: boolean
    spotifyUri: boolean
    spotifyCover: boolean
}

export type SongImportPreferences = {
    cover: boolean
    completion: boolean
    record: boolean
    createdAt: boolean
    spotifyUri: boolean
    spotifyCover: boolean
}

type State = {
    typerTextDisplay: TyperTextDisplay
    verseTyperTextDisplay: TyperTextDisplay
    queueStorage: QueueStorage
    isCompletionAnim: boolean
    isErrorAnim: boolean
    isCorrectAnim: boolean
    isQueueColour: boolean
    isOpenEndScreenInitially: boolean
    isOpenEndScreenInitiallyVersePage: boolean
    songList: SongList
    songExportPreferences: SongExportPreferences
    songImportPreferences: SongImportPreferences
}

type Actions = {
    setTyperTextDisplay: (val: TyperTextDisplay) => void
    setVerseTyperTextDisplay: (val: TyperTextDisplay) => void
    setQueueStorage: (val: QueueStorage) => void
    setCompletionAnim: (val: boolean) => void
    setErrorAnim: (val: boolean) => void
    setCorrectAnim: (val: boolean) => void
    setQueueColour: (val: boolean) => void
    setSongListPref: (val: SongList) => void
    setOpenEndScreenInitially: (val: boolean) => void
    setOpenEndScreenInitiallyVersePage: (val: boolean) => void
    updateImportPreferences: <K extends keyof SongImportPreferences>(key: K, value: boolean) => void
    updateExportPreferences: <K extends keyof SongExportPreferences>(key: K, value: boolean) => void
    resetPreferences: () => void
    resetImportPreferences: () => void
    resetExportPreferences: () => void
}

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
    songExportPreferences: {
        completion: false,
        record: false,
        createdAt: true,
        cover: true,
        spotifyCover: true,
        spotifyUri: true,
    },
    songImportPreferences: {
        completion: false,
        record: false,
        createdAt: true,
        cover: true,
        spotifyCover: true,
        spotifyUri: true,
    },
}

const usePreferenceStoreBase = create<State & Actions>()(
    persist(
        (set, get) => ({
            ...defaults,
            setTyperTextDisplay: (val: TyperTextDisplay) =>
                set(() => {
                    return { typerTextDisplay: val }
                }),
            setVerseTyperTextDisplay: (val: TyperTextDisplay) =>
                set(() => {
                    return { verseTyperTextDisplay: val }
                }),
            setQueueStorage: (val: QueueStorage) =>
                set(() => {
                    return { queueStorage: val }
                }),
            setCompletionAnim: (val: boolean) =>
                set(() => {
                    return { isCompletionAnim: val }
                }),
            setErrorAnim: (val: boolean) =>
                set(() => {
                    return { isErrorAnim: val }
                }),
            setCorrectAnim: (val: boolean) =>
                set(() => {
                    return { isCorrectAnim: val }
                }),
            setOpenEndScreenInitially: (val: boolean) =>
                set(() => {
                    return { isOpenEndScreenInitially: val }
                }),
            setOpenEndScreenInitiallyVersePage: (val: boolean) =>
                set(() => {
                    return { isOpenEndScreenInitiallyVersePage: val }
                }),
            setSongListPref: (val: SongList) =>
                set(() => {
                    return { songList: val }
                }),
            setQueueColour: (val: boolean) =>
                set(() => {
                    return { isQueueColour: val }
                }),
            updateImportPreferences: (key, value) =>
                set(() => {
                    return {
                        ...get(),
                        songImportPreferences: { ...get().songImportPreferences, [key]: value },
                    }
                }),
            updateExportPreferences: (key, value) =>
                set(() => {
                    return {
                        ...get(),
                        songExportPreferences: { ...get().songExportPreferences, [key]: value },
                    }
                }),
            resetExportPreferences: () =>
                set(() => {
                    return { songExportPreferences: defaults.songExportPreferences }
                }),
            resetImportPreferences: () =>
                set(() => {
                    return { songImportPreferences: defaults.songImportPreferences }
                }),
            resetPreferences: () =>
                set(() => {
                    return defaults
                }),
        }),
        {
            name: "typer-preferences-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
)

const usePreferenceStore = createSelectors(usePreferenceStoreBase)

export { usePreferenceStore }

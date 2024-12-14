import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { createSelectors } from "./create-selectors"

export const SPOTIFY_WEB_PLAYER_SHORTCUTS = {
    TOGGLE_PLAYBACK: "toggle-playback",
    RESTART_PLAYBACK: "restart-playback",
    PLAYBACK_SEEK_FORWARD: "playback-seek-forward",
    PLAYBACK_SEEK_BACKWARD: "playback-seek-backward",
}

export const TYPER_SHORTCUTS = {
    RESTART: "restart-typer",
}

export const ALL_SHORTCUTS = {
    ...SPOTIFY_WEB_PLAYER_SHORTCUTS,
    ...TYPER_SHORTCUTS,
}

type AvailableShortcut = (typeof ALL_SHORTCUTS)[keyof typeof ALL_SHORTCUTS]

export type Shortcut = {
    hotkeys: string[]
    defaultHotkeys: string[]
    id: AvailableShortcut
    enabled: boolean
    label: string
}

type State = {
    shortcuts: Shortcut[]
}

interface Actions {
    toggleShortcut: (id: string, enabled?: boolean) => void
    reset: () => void
}

const DEFAULTS: State = {
    shortcuts: [
        {
            id: SPOTIFY_WEB_PLAYER_SHORTCUTS.TOGGLE_PLAYBACK,
            hotkeys: ["alt+k"],
            defaultHotkeys: ["alt+j"],
            label: "Toggle playback",
            enabled: true,
        },
        {
            id: SPOTIFY_WEB_PLAYER_SHORTCUTS.RESTART_PLAYBACK,
            hotkeys: ["alt+r"],
            defaultHotkeys: ["alt+r"],
            label: "Restart playback",
            enabled: true,
        },
        {
            id: SPOTIFY_WEB_PLAYER_SHORTCUTS.PLAYBACK_SEEK_FORWARD,
            hotkeys: ["alt+l"],
            defaultHotkeys: ["alt+l"],
            label: "Playback seek forward",
            enabled: true,
        },
        {
            id: SPOTIFY_WEB_PLAYER_SHORTCUTS.PLAYBACK_SEEK_BACKWARD,
            hotkeys: ["alt+j"],
            defaultHotkeys: ["alt+j"],
            label: "Playback seek backward",
            enabled: true,
        },
        {
            id: TYPER_SHORTCUTS.RESTART,
            hotkeys: ["esc"],
            defaultHotkeys: ["esc"],
            label: "Restart",
            enabled: true,
        },
    ],
}

const useShortcutsStoreBase = create<State & Actions>()(
    persist(
        (set) => ({
            ...DEFAULTS,
            toggleShortcut: (id, enabled) => {
                set((state) => {
                    const shortcut = state.shortcuts.find((x) => x.id === id)

                    if (!shortcut) return state

                    return {
                        ...state,
                        shortcuts: [
                            ...state.shortcuts.filter((x) => x.id !== shortcut.id),
                            { ...shortcut, enabled: enabled ?? !shortcut.enabled },
                        ],
                    }
                })
            },
            reset: () => set(DEFAULTS),
        }),
        {
            name: "typer-shortcuts-store",
            storage: createJSONStorage(() => localStorage),
        }
    )
)

const useShortcutInfo = (id: AvailableShortcut) => {
    const shortcuts = useShortcutsStore.use.shortcuts()
    return shortcuts.find((x) => x.id === id)
}

const useShortcutsStore = createSelectors(useShortcutsStoreBase)

export { useShortcutsStore, useShortcutInfo }

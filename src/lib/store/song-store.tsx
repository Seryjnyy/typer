import { create } from "zustand"

import { persist, createJSONStorage } from "zustand/middleware"
import { createSelectors } from "./create-selectors"
import { Song } from "../types"
import { removeMultipleWhitespacesInARow } from "@/lib/utils.ts"

interface Store {
    songs: Song[]
    upsertSong: (song: Song) => void
    removeSong: (songId: string) => void
    setSongs: (songs: Song[]) => void
    getSongData: (songId: string) => Song | undefined
    updateSongCompletion: (id: string, completion: number) => void
    updateSongRecord: (id: string, record: { wpm: number; accuracy: number }) => void
}

// Breaks stuff in typer so very important it is done, therefore this is here
// Split into lines, trim each line
// Remove empty strings (where line was just space)
const trimSongContent = (content: string) => {
    const split = content.split("\n")

    const replaced = split.map((x) => (x == "" ? "\n" : x))

    const trimmed = replaced.map((x) => x.trim())

    // join verses with new lines, but replace multiple new lines into a single one
    // not sure why there are multiple new lines sometimes, have to check, but this is a quick fix for it
    return trimmed.join("\n")
}

const formatTitleOrSource = (str: string) => {
    // Replace new lines and tabs with a space
    // Replace multiple spaces with a single space
    // Remove leading and trailing whitespace
    return str
        .replace(/[\n\t\r]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
}

const removeExtras = (str: string) => {
    // Removes [Verse 1] [Chorus] etc.
    return str.replace(/\[.*?]/g, "").trim()
}

const useSongStoreBase = create<Store>()(
    persist(
        (set, get) => ({
            songs: [],
            upsertSong: (song) =>
                set(() => {
                    const songs = get().songs
                    const filtered = songs.filter((x) => x.id !== song.id)

                    return {
                        songs: [
                            ...filtered,
                            {
                                ...song,
                                content: removeExtras(removeMultipleWhitespacesInARow(trimSongContent(song.content))),
                                title: formatTitleOrSource(song.title),
                                source: formatTitleOrSource(song.source),
                            },
                        ],
                    }
                }),
            setSongs: (songs) =>
                set(() => {
                    return { songs: songs }
                }),
            removeSong: (songId) =>
                set(() => {
                    const filtered = get().songs.filter((x) => x.id != songId)
                    return { songs: filtered }
                }),
            getSongData: (songId) => {
                return get().songs.find((song) => song.id == songId)
            },
            updateSongCompletion: (id, completion) =>
                set(() => {
                    const song = get().songs.find((x) => x.id == id)

                    if (!song) return {}

                    const songs = get().songs.filter((x) => x.id != id)

                    return {
                        songs: [...songs, { ...song, completion: completion }],
                    }
                }),
            updateSongRecord: (id, record) =>
                set(() => {
                    const state = get()
                    const song = state.songs.find((x) => x.id == id)

                    if (!song) return state

                    const songs = get().songs.filter((x) => x.id != id)

                    return {
                        songs: [...songs, { ...song, record: record }],
                    }
                }),
        }),
        {
            name: "typer-song-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
)

const useSongStore = createSelectors(useSongStoreBase)

export { useSongStore }

import { create } from "zustand"

import { persist, createJSONStorage } from "zustand/middleware"
import { createSelectors } from "./create-selectors"
import { Song } from "../types"
import { removeMultipleWhitespacesInARow } from "@/lib/utils.ts"

interface Store {
    songs: Song[]
    addSong: (song: Song) => void
    removeSong: (songId: string) => void
    setSongs: (songs: Song[]) => void
    getSongData: (songId: string) => Song | undefined
    editSongCompletion: (id: string, completion: number) => void
    editSongRecord: (id: string, record: { wpm: number; accuracy: number }) => void
    editSong: (song: Song) => void
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

const useSongStoreBase = create<Store>()(
    persist(
        (set, get) => ({
            songs: [],
            addSong: (song) =>
                set(() => {
                    if (get().songs.find((x) => x.id == song.id) != null) {
                        return { songs: get().songs }
                    }

                    return {
                        songs: [
                            ...get().songs,
                            {
                                ...song,
                                content: trimSongContent(song.content),
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
            editSongCompletion: (id, completion) =>
                set(() => {
                    const song = get().songs.find((x) => x.id == id)

                    if (!song) return {}

                    const songs = get().songs.filter((x) => x.id != id)
                    console.log(completion)
                    return {
                        songs: [...songs, { ...song, completion: completion }],
                    }
                }),
            editSongRecord: (id, record) =>
                set(() => {
                    const state = get()
                    const song = state.songs.find((x) => x.id == id)

                    if (!song) return state

                    const songs = get().songs.filter((x) => x.id != id)

                    return {
                        songs: [...songs, { ...song, record: record }],
                    }
                }),
            editSong: (song) =>
                set(() => {
                    const filtered = get().songs.filter((x) => x.id != song.id)

                    return {
                        songs: [...filtered, { ...song, content: removeMultipleWhitespacesInARow(trimSongContent(song.content)) }],
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

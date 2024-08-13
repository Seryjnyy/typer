import { create } from "zustand";

import { persist, createJSONStorage } from "zustand/middleware";
import { createSelectors } from "./create-selectors";
import { Song } from "../types";

interface Store {
    songs: Song[];
    addSong: (song: Song) => void;
    removeSong: (songId: string) => void;
    getSongData: (songId: string) => Song | undefined;
}

const useSongStoreBase = create<Store>()(
    persist(
        (set, get) => ({
            songs: [],
            addSong: (song) =>
                set(() => {
                    if (get().songs.find((x) => x.id == song.id) != null) {
                        return { songs: get().songs };
                    }

                    return { songs: [...get().songs, song] };
                }),
            removeSong: (songId) =>
                set(() => {
                    const filtered = get().songs.filter((x) => x.id != songId);
                    return { songs: filtered };
                }),
            getSongData: (songId) => {
                return get().songs.find((song) => song.id == songId);
            },
        }),
        {
            name: "typer-song-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

const useSongStore = createSelectors(useSongStoreBase);

export { useSongStore };

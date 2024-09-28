import { create } from "zustand";

import { createJSONStorage, persist } from "zustand/middleware";
import { createSelectors } from "./create-selectors";

// Dont use songs directly cause there is no mechanism to make sure songs are valid (they could have been deleted)
// Use the getPlaylistSongs func from usePlaylist
export type Playlist = {
    id: string;
    title: string;
    dontUsesDirectlySongs: string[];
    createdAt: number;
    lastModifiedAt: number;
};

type State = {
    playlists: Playlist[];
};

type Actions = {
    addPlaylist: (playlist: Playlist) => void;
    editPlaylist: (playlist: Playlist) => void;
    deletePlaylist: (id: string) => void;
    deleteAllPlaylists: () => void;
};

const defaults: State = {
    playlists: [],
};

const usePlaylistStoreBase = create<State & Actions>()(
    persist(
        (set, get) => ({
            ...defaults,
            addPlaylist: (playlist) =>
                set(() => {
                    return {
                        playlists: [...get().playlists, playlist],
                    };
                }),
            editPlaylist: (playlist) =>
                set(() => {
                    return {
                        playlists: [
                            ...get().playlists.filter(
                                (x) => x.id != playlist.id
                            ),
                            playlist,
                        ],
                    };
                }),
            deletePlaylist: (id) =>
                set(() => {
                    return {
                        playlists: [
                            ...get().playlists.filter((x) => x.id != id),
                        ],
                    };
                }),
            deleteAllPlaylists: () =>
                set(() => {
                    return { playlists: [] };
                }),
        }),
        {
            name: "typer-playlist-store",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

const usePlaylistStore = createSelectors(usePlaylistStoreBase);

export { usePlaylistStore };

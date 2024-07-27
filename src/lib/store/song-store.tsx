import { Song } from "@/content";
import { create } from "zustand";

import { persist, createJSONStorage } from "zustand/middleware";
import { createSelectors } from "./create-selectors";

type Store = {
  songs: Song[];
  addSong: (song: Song) => void;
  removeSong: (songId: string) => void;
};

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
    }),
    {
      name: "typer-song-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

const useSongStore = createSelectors(useSongStoreBase);

export { useSongStore };

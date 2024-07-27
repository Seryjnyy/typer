import { create } from "zustand";
import { createSelectors } from "./create-selectors";

type Store = {
  songs: string[];
  addSong: (songId: string) => void;
  removeSong: (songId: string) => void;
  current: string | null;
  setCurrent: (newCurrentSong: string) => void;
};

// TODO : Idk If I like having queue logic everywhere
const useQueueStoreBase = create<Store>((set) => ({
  current: null,
  setCurrent: (newCurrentSong) => set((state) => ({ current: newCurrentSong })),
  songs: [],
  addSong: (songId) =>
    set((state) => {
      if (state.songs.find((x) => x == songId) != null) {
        return { songs: state.songs };
      }

      const current = state.songs.length == 0 ? songId : state.current;

      return { songs: [...state.songs, songId], current: current };
    }),
  removeSong: (songId) =>
    set((state) => {
      const songIndex = state.songs.findIndex((x) => x == songId);
      const songs = state.songs.filter((x) => x != songId);

      let current = state.current;
      // If only one song left then set it as current song
      if (songs.length == 1) {
        current = songs[0];
      } else if (songs.length == 0) {
        // If no songs left in queue
        current = null;
      } else if (songId == current) {
        // If removed song was current song and there is some songs left in queue
        let newIndex = -1;
        if (songIndex + 1 < songs.length) {
          newIndex = songIndex + 1;
        } else if (songIndex - 1 >= 0) {
          newIndex = songIndex - 1;
        }

        console.log("🚀 ~ set ~ songIndex:", songIndex);
        console.log("🚀 ~ set ~ newIndex:", newIndex);
        current = newIndex != -1 ? songs[newIndex] : null;
      }

      console.log("remaining", songs, "current", current);

      return { songs: songs, current: current };
    }),
}));

const useQueueStore = createSelectors(useQueueStoreBase);

export { useQueueStore };

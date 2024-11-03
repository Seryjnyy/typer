import { createSelectors } from "@/lib/store/create-selectors";
import { Song } from "@/lib/types";
import { create } from "zustand";

interface PlayableSongStore {
    playableSong: Song | null;
    setPlayableSong: (playableSong: Song | null) => void;
}

const usePlayableSongStoreBase = create<PlayableSongStore>()((set) => ({
    playableSong: null,
    setPlayableSong: (playableSong: Song | null) => set({ playableSong }),
}));

const usePlayableSongStore = createSelectors(usePlayableSongStoreBase);

export { usePlayableSongStore };

import { create } from "zustand";
import { createSelectors } from "./create-selectors";

type Store = {
    songs: string[];
    setSongs: (songs: string[]) => void;
    enqueue: (songId: string, position?: number) => void;
    playNow: (songId: string) => void;
    playNext: (songId: string) => void;
    removeSong: (songId: string) => void;
    current: string | null;
    setCurrent: (newCurrentSong: string) => void;
};

const insertIntoList = (list: string[], position: number) => {};

// TODO : Idk If I like having queue logic everywhere
const useQueueStoreBase = create<Store>((set) => ({
    current: null,
    setCurrent: (newCurrentSong) =>
        set((state) => ({ current: newCurrentSong })),
    songs: [],
    setSongs: (songs) => set((state) => ({ songs: songs })),
    enqueue: (songId, position) =>
        set((state) => {
            // Already in queue
            if (state.songs.find((x) => x == songId) != null) {
                return { songs: state.songs };
            }

            // If no songs in queue set this new one as current
            const current = state.songs.length == 0 ? songId : state.current;

            // Insert in position or else just append
            if (position && position >= 0 && position) {
                // Check if position is valid

                const currentIndex = state.songs.findIndex((x) => x == current);

                //
                // if(position ==  currentIndex){

                // }

                return {};
            } else {
                return { songs: [...state.songs, songId], current: current };
            }
        }),
    playNow: (songId) =>
        set((state) => {
            // Already in queue
            if (state.songs.find((x) => x == songId) != null) {
                return { songs: state.songs };
            }

            // If empty
            if (state.songs.length == 0) {
            } else {
            }
            // If no songs in queue set this new one as current
            const current = state.songs.length == 0 ? songId : state.current;

            // Insert in position or else just append
            // if(position && position >= 0 && position){
            //   // Check if position is valid

            //   state.
            //   const currentIndex = state.songs.findIndex(x => x == current)

            //   //
            //   if(position ==  currentIndex){

            //   }

            //   return {}
            // }else{

            // }
            return { songs: [...state.songs, songId], current: current };
        }),
    playNext: (songId) =>
        set((state) => {
            // Already in queue
            if (state.songs.find((x) => x == songId) != null) {
                return { songs: state.songs };
            }

            // If no songs in queue set this new one as current
            const current = state.songs.length == 0 ? songId : state.current;

            // Insert in position or else just append
            // if(position && position >= 0 && position){
            //   // Check if position is valid

            //   const currentIndex = state.songs.findIndex(x => x == current)

            //   //
            //   if(position ==  currentIndex){

            //   }

            //   return {}
            // }else{

            // }
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

                current = newIndex != -1 ? songs[newIndex] : null;
            }

            return { songs: songs, current: current };
        }),
}));

const useQueueStore = createSelectors(useQueueStoreBase);

export { useQueueStore };

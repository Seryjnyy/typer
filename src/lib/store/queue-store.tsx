import { create } from "zustand";
import { createSelectors } from "./create-selectors";
import { persist, createJSONStorage } from "zustand/middleware";

// TODO : A lot of this should be off loaded from the store, maybe a hook
type Store = {
    songs: string[];
    setSongs: (songs: string[]) => void;
    enqueue: (songId: string, position?: number) => void;
    playNow: (songId: string) => void;
    playNext: (songId: string) => void;
    removeSong: (songId: string) => void;
    current: string | null;
    setCurrent: (newCurrentSong: string) => void;
    autoplay: boolean;
    setAutoplay: (autoplay: boolean) => void;
    next: () => void;
};

// TODO : Idk If I like having queue logic everywhere
const useQueueStoreBase = create<Store>(
    persist(
        (set, get) => ({
            next: () =>
                set(() => {
                    const state = get();
                    const currentId = state.songs.findIndex(
                        (x) => x == state.current
                    );

                    if (currentId == -1) {
                    } else {
                        if (currentId + 1 >= state.songs.length) {
                            return { ...state };
                        } else {
                            return { current: state.songs[currentId + 1] };
                        }
                    }
                }),
            current: null,
            setCurrent: (newCurrentSong) =>
                set(() => ({ current: newCurrentSong })),
            songs: [],
            setSongs: (songs) => set(() => ({ songs: songs })),
            autoplay: false,
            setAutoplay: (autoplay) => set(() => ({ autoplay: autoplay })),
            enqueue: (songId, position) =>
                set(() => {
                    const state = get();
                    // Already in queue
                    if (state.songs.find((x) => x == songId) != null) {
                        return { songs: state.songs };
                    }

                    // If no songs in queue set this new one as current
                    const current =
                        state.songs.length == 0 ? songId : state.current;

                    // Insert in position or else just append
                    if (position && position >= 0 && position) {
                        // Check if position is valid

                        const currentIndex = state.songs.findIndex(
                            (x) => x == current
                        );

                        //
                        // if(position ==  currentIndex){

                        // }

                        return { ...state };
                    } else {
                        return {
                            songs: [...state.songs, songId],
                            current: current,
                        };
                    }
                }),
            playNow: (songId) =>
                set(() => {
                    const state = get();
                    // Already in queue
                    if (state.songs.find((x) => x == songId) != null) {
                        return { songs: state.songs };
                    }

                    // If empty
                    if (state.songs.length == 0) {
                    } else {
                    }
                    // If no songs in queue set this new one as current
                    const current =
                        state.songs.length == 0 ? songId : state.current;

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
                    return {
                        songs: [...state.songs, songId],
                        current: current,
                    };
                }),
            playNext: (songId) =>
                set(() => {
                    const state = get();
                    // Already in queue
                    if (state.songs.find((x) => x == songId) != null) {
                        return { songs: state.songs };
                    }

                    // If no songs in queue set this new one as current
                    const current =
                        state.songs.length == 0 ? songId : state.current;

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
                    return {
                        songs: [...state.songs, songId],
                        current: current,
                    };
                }),

            removeSong: (songId) =>
                set(() => {
                    const state = get();
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
        }),
        {
            name: "typer-queue-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

const useQueueStore = createSelectors(useQueueStoreBase);

export { useQueueStore };

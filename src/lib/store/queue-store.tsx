import { create } from "zustand";
import { createSelectors } from "./create-selectors";
import { persist, createJSONStorage } from "zustand/middleware";

// TODO : A lot of this should be off loaded from the store, maybe a hook

type State = {
    songs: string[];
    current: string | null;
    autoplay: boolean;
    // loop: number;
};

type Actions = {
    // setLoop:(val:number)=>void;
    setSongs: (songs: string[]) => void;
    enqueue: (
        songId: string,
        setNewCurrent?: boolean,
        position?: number
    ) => void;
    // playNow: (songId: string) => void;
    queueNext: (songId: string) => void;
    removeSong: (songId: string) => void;
    setCurrent: (newCurrentSong: string) => void;
    setAutoplay: (autoplay: boolean) => void;
    next: () => void;
    prev: () => void;
    getNextSong: () => string | null;
    getPrevSong: () => string | null; // TODO : bad naming, previous means one that was played before but this function just gets the song that comes before in the list
};

const defaults: State = {
    current: null,
    songs: [],
    autoplay: false,
    // loop: 0,
};

// Check if user has a preference for the queue storage
let preferredStorageType = "localStorage";
const preferenceStore = localStorage.getItem("typer-preferences-storage");
if (preferenceStore) {
    const storedQueueStoragePreference =
        JSON.parse(preferenceStore).state?.queueStorage;

    if (storedQueueStoragePreference) {
        preferredStorageType = storedQueueStoragePreference;
    }
    console.log(storedQueueStoragePreference);
}

const useQueueStoreBase = create<State & Actions>()(
    persist(
        (set, get) => ({
            ...defaults,
            // setLoop: (val) => set(() => ({loop:val})),
            next: () =>
                set(() => {
                    const state = get();
                    const currentId = state.songs.findIndex(
                        (x) => x == state.current
                    );

                    if (currentId == -1) {
                        return { ...state };
                    } else {
                        if (currentId + 1 >= state.songs.length) {
                            return { ...state };
                        } else {
                            return { current: state.songs[currentId + 1] };
                        }
                    }
                }),
            prev: () =>
                set(() => {
                    const state = get();
                    const currentId = state.songs.findIndex(
                        (x) => x == state.current
                    );

                    if (currentId == -1) {
                        return { ...state };
                    } else {
                        if (currentId - 1 < 0) {
                            return { ...state };
                        } else {
                            return { current: state.songs[currentId - 1] };
                        }
                    }
                }),
            setCurrent: (newCurrentSong) =>
                set(() => ({ current: newCurrentSong })),
            setSongs: (songs) =>
                set(() => {
                    return { songs: songs, current: null };
                }),
            setAutoplay: (autoplay) => set(() => ({ autoplay: autoplay })),
            enqueue: (songId, setNewCurrent, position) =>
                set(() => {
                    const state = get();
                    // Already in queue
                    if (state.songs.find((x) => x == songId) != null) {
                        return { songs: state.songs };
                    }

                    // If no songs in queue set this new one as current
                    let current = state.current;
                    if (setNewCurrent) {
                        current =
                            state.songs.length == 0 ? songId : state.current;
                    }

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
            // playNow: (songId) =>
            //     set(() => {
            //         const state = get();

            //         // Already in queue
            //         if (state.songs.find((x) => x == songId) != null) {
            //             return { songs: state.songs };
            //         }

            //         // If empty
            //         if (state.songs.length == 0) {
            //         } else {
            //         }
            //         // If no songs in queue set this new one as current
            //         const current =
            //             state.songs.length == 0 ? songId : state.current;

            //         return {
            //             songs: [...state.songs, songId],
            //             current: current,
            //         };
            //     }),
            queueNext: (songId) =>
                set(() => {
                    const state = get();
                    // Already in queue
                    if (state.songs.find((x) => x == songId) != null) {
                        // const filtered = state.songs.filter(
                        //     (song) => song != songId
                        // );

                        return { songs: state.songs };
                    }

                    // If no songs in queue set this new one as current
                    const current =
                        state.songs.length == 0 ? songId : state.current;

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
            getNextSong: () => {
                const state = get();

                // If no current return null
                if (state.current == null) return null;

                const currentIndex = state.songs.findIndex(
                    (songID) => songID == state.current
                );

                if (currentIndex == -1) return null;

                if (currentIndex + 1 >= state.songs.length) return null;

                return state.songs[currentIndex + 1];
            },
            getPrevSong: () => {
                const state = get();

                // If no current return null
                if (state.current == null) return null;

                const currentIndex = state.songs.findIndex(
                    (songID) => songID == state.current
                );

                // Couldn't find current in list
                if (currentIndex == -1) return null;

                if (currentIndex - 1 < 0) return null;

                return state.songs[currentIndex - 1];
            },
        }),
        {
            name: "typer-queue-storage",
            storage:
                preferredStorageType == "localStorage"
                    ? createJSONStorage(() => localStorage)
                    : createJSONStorage(() => sessionStorage),
            // storage: createJSONStorage(() => localStorage),
        }
    )
);

const useQueueStore = createSelectors(useQueueStoreBase);

export { useQueueStore };

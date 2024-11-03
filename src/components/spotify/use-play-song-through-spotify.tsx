import { Song } from "@/lib/types";
import { usePlayableSongStore } from "@/spotify/player/playable-song-store";

// TODO : this could take the song as param, and then also export isCurrentlyPlaying, but idk if thats better
export const usePlaySongThroughSpotify = () => {
    const setPlayableSong = usePlayableSongStore.use.setPlayableSong();
    const playableSong = usePlayableSongStore.use.playableSong();

    const setPlayableSongHandler = (song: Song | null) => {
        setPlayableSong(song);
    };

    return {
        currentPlayableSong: playableSong,
        setPlayableSong: setPlayableSongHandler,
    };
};

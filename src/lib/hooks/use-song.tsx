import { useSongStore } from "@/lib/store/song-store.tsx"
import { useMemo } from "react"

function useSong(songID: string) {
    const songs = useSongStore.use.songs()
    return useMemo(() => songs.find((song) => song.id == songID), [songs, songID])
}

export { useSong }

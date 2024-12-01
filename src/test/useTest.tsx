import { useSongStore } from '@/lib/store/song-store.tsx'
import { useQueueStore } from '@/lib/store/queue-store.tsx'
import { useMemo } from 'react'

const useCurrentSong = () => {
    const songList = useSongStore.use.songs()
    const currentSongInQueue = useQueueStore.use.current()
    return useMemo(
        () => songList.find((x) => x.id == currentSongInQueue),
        [songList, currentSongInQueue]
    )
}

export { useCurrentSong }

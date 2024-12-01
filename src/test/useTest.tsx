import { useSongStore } from '@/lib/store/song-store.tsx'
import { useQueueStore } from '@/lib/store/queue-store.tsx'
import { useMemo } from 'react'
import { Song } from '@/lib/types.ts'
import { useTextModificationsStore } from '@/lib/store/text-modifications-store.tsx'
import { splitSongIntoVerses, textModification } from '@/lib/utils.ts'

const useCurrentSong = () => {
    const songList = useSongStore.use.songs()
    const currentSongInQueue = useQueueStore.use.current()
    return useMemo(
        () => songList.find((x) => x.id == currentSongInQueue),
        [songList, currentSongInQueue]
    )
}

export { useCurrentSong }
const useProcessedSongContent = (song: Song | undefined) => {
    const txtMods = useTextModificationsStore.use.textModifications()

    const songTextModified = song
        ? textModification(song.content, txtMods)
        : null

    return useMemo(() => {
        return song && songTextModified
            ? {
                  fullUnmodifiedText: song.content,
                  fullModifiedText: songTextModified,
                  strippedModifiedText: songTextModified.replace(
                      /(\r\n|\n|\r)/gm,
                      ''
                  ),
              }
            : {
                  fullModifiedText: '',
                  fullUnmodifiedText: '',
                  strippedModifiedText: '',
              }
    }, [song, songTextModified])
}

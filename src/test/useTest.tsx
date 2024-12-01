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

// cache everything thats is not current verse
// cache even everything that is not current line
const useCalculateStuff = ({ input }: { input: string }) => {
    const song = useCurrentSong()
    const processedContent = useProcessedSongContent(song)
    const verseSplit = splitSongIntoVerses(processedContent.fullUnmodifiedText)
    const verses = verseSplit.map((verse) =>
        verse.split(/\r?\n/).map((line) => Array.from(line))
    )

    let charIndex = 0

    // 0 incorrect
    // 1 correct
    // 2 not-covered yet
    const res = verses.map((verse) =>
        verse.map((line) =>
            line.map((char) => {
                if (charIndex < input.length) {
                    if (input[charIndex] === char) {
                        charIndex++
                        return 1
                    }
                    charIndex++
                    return 0
                }
                charIndex++
                return 2
            })
        )
    )

    // const verseCount = verses.length
    // const versesLinesCount = verses.map(verse => verse.length)
    //
    //
    // const result = matchInputToVerses(input.split(''), verses);
    //
    // console.log(verses)
    // console.log(result)

    // return [orgCh, ("" if correct, else correctCh)]
    return {
        verses: verses,
        versesResult: res,
        lineCount: verses
            .map((verse) => verse.length)
            .reduce((prev, curr) => prev + curr),
    }
}

export { useCurrentSong, useProcessedSongContent, useCalculateStuff }

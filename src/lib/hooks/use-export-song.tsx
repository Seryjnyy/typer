import saveAs from "file-saver"
import { useMemo, useState } from "react"
import { songMandatoryExports, usePreferenceStore } from "../store/preferences-store"
import { Song } from "../types"

type FilterConfig = {
    [Key in keyof Song]?: boolean // Properties are optional and boolean
}

// Go through the songs properties and check if that property is true in the config (undefined is false)
const filterSongProperties = (song: Song, config: FilterConfig): Partial<Song> => {
    if (config) {
        return Object.fromEntries(
            Object.entries(song).filter(([key]) => {
                return config[key as keyof Song] === true
            })
        )
    }
    return song
}

export default function useExportSongs() {
    const [exported, setExported] = useState(0)
    const songExportPreferences = usePreferenceStore.use.songExportPreferences()
    const exportConfig = useMemo(() => ({ ...songExportPreferences, ...songMandatoryExports }) as FilterConfig, [songExportPreferences])

    const exportSongs = async (songs: Song[]) => {
        if (songs.length == 0) return

        // Filter song properties so that only the ones the user wants to export are present.
        const filteredSongs = songs.map((song) => filterSongProperties(song, exportConfig))

        const songsArr = { songs: filteredSongs }
        const json = JSON.stringify(songsArr, null, 2)

        const blob = new Blob([json], { type: "application/json" })
        saveAs(blob, `(${songs.length})-typer-songs.json`)
        setExported(songs.length)
    }

    const clear = () => {
        setExported(0)
    }

    return { clear, exported, exportSongs }
}

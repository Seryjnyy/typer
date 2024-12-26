import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import useCreateSong from "@/lib/hooks/use-create-song"
import { useState } from "react"
import { Link } from "react-router-dom"

import { z } from "zod"
import { usePreferenceStore } from "../store/preferences-store"
import { Song } from "@/lib/types.ts"
import { importSongSchema } from "@/lib/schemas/song.ts"

// TODO : There is no max value, this shit could blow up, idk what max to set
const jsonSchema = z.object({
    songs: z.array(z.any()),
})

export default function useImportSongs() {
    const songImportPreferences = usePreferenceStore.use.songImportPreferences()

    const createSong = useCreateSong()
    const [imported, setImported] = useState("")
    const [error, setError] = useState("")

    const processJSONfile = async (file: File) => {
        if (file.type != "application/json") {
            console.error("Incorrect file format")
            return
        }

        const text = await file.text()

        try {
            const parsed = JSON.parse(text)

            const result = jsonSchema.safeParse(parsed)

            if (result.error || !result.success) {
                console.error("Failed to parse JSON.")
                return
            }

            const parsedSongs = result.data.songs.map((song: Song) => {
                const songParseResult = importSongSchema.safeParse(song)
                if (!songParseResult.success) {
                    console.error("Invalid song found:", songParseResult.error.errors)

                    return null
                }
                return songParseResult.data
            })

            const validSongs = parsedSongs.filter(Boolean)
            console.log(`Successfully parsed ${validSongs.length}/${parsedSongs.length} songs.`)

            validSongs.forEach((song) => {
                // Check with import preferences
                if (song) {
                    createSong({
                        ...song,
                        cover: songImportPreferences.cover ? JSON.stringify(song.cover) : undefined,
                        completion: songImportPreferences.completion ? song.completion : undefined,
                        createdAt: songImportPreferences.createdAt ? song.createdAt : undefined,
                        record: songImportPreferences.record ? song.record : undefined,
                    })
                }
            })

            toast({
                title: `Successfully imported songs.`,
                description:
                    validSongs.length == parsedSongs.length
                        ? "All songs imported."
                        : `Couldn't import some songs. (${validSongs.length}/${parsedSongs.length})`,
                variant: "success",
                action: (
                    <Link to={`/songs`}>
                        <Button variant={"outline"}>View songs list</Button>
                    </Link>
                ),
            })

            setImported(`${validSongs.length}/${parsedSongs.length}`)
        } catch (error) {
            // TODO : not implemented properly yet
            // TODO : better error messages

            if (error instanceof SyntaxError) {
                setError(JSON.stringify(error.message))
            } else {
                setError("Something went wrong. Please check the JSON file and try again.")
            }

            console.error(error)
            return
        }
    }

    const clear = () => {
        setImported("")
        setError("")
    }

    return { processJSONfile, imported, error, clear }
}

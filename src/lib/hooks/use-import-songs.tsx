import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import useCreateSong from "@/lib/hooks/use-create-song"
import { useState } from "react"
import { Link } from "react-router-dom"

import { z } from "zod"
import { usePreferenceStore } from "../store/preferences-store"
import { Song } from "@/lib/types.ts"

// Regex for validating "rgb(n1, n2, n3)" format
const rgbColorRegex = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/

const coverSchema = z
    .object({
        type: z.literal("linear-gradient"),
        dir: z.number(),
        colours: z.array(
            z.string().refine(
                (color) => {
                    const match = color.match(rgbColorRegex)
                    if (!match) return false
                    // Extract RGB values and ensure each is between 0 and 255
                    const [r, g, b] = match.slice(1).map(Number)
                    return [r, g, b].every((value) => value >= 0 && value <= 255)
                },
                {
                    message: "Colours must be in the format 'rgb(n, n, n)' with n between 0 and 255",
                }
            )
        ),
    })
    .optional()

const importSongSchema = z.object({
    title: z.string().min(1).max(150).regex(/\S+/, {
        message: "Content cannot be just whitespace characters",
    }),
    source: z.string().min(1).max(150).regex(/\S+/, {
        message: "Content cannot be just whitespace characters",
    }),
    content: z.string().min(1).max(8000).regex(/\S+/, {
        message: "Content cannot be just whitespace characters",
    }),
    cover: z.preprocess((data) => {
        if (typeof data !== "string") return undefined
        const parsedCover = coverSchema.safeParse(JSON.parse(data))
        return parsedCover.success ? parsedCover.data : undefined
    }, coverSchema),
    completion: z.number().int().nonnegative().optional().catch(undefined),
    record: z
        .object({
            wpm: z.number().nonnegative(),
            accuracy: z.number().nonnegative().max(100),
        })
        .optional()
        .catch(undefined),
    createdAt: z
        .number()
        .int()
        .nonnegative({
            message: "Timestamp must be a non negative number.",
        })
        .refine(
            (timestamp) => {
                const date = new Date(timestamp)
                return date.getTime() > 0 && !isNaN(date.getTime())
            },
            { message: "Invalid timestamp" }
        )
        .optional()
        .catch(undefined),
    spotifyUri: z
        .string()
        .regex(/^spotify:track:[a-zA-Z0-9]{22}$/, {
            message: "Invalid Spotify URI format",
        })
        .optional()
        .catch(undefined),
    spotifyCover: z
        .string()
        .url()
        .regex(/^https:\/\/[a-zA-Z0-9.]*scdn\.co\/image\/[a-zA-Z0-9]{40,}$/, {
            message: "Invalid Spotify cover URL format",
        }),
})

// TODO : There is no max value, this shit could blow up, idk what max to set
const jsonSchema = z.object({
    songs: z.array(z.any()),
})

// Not sure if should be a hook but its taking up a lot of space

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

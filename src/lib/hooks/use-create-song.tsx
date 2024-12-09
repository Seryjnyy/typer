import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { PlayIcon } from "@radix-ui/react-icons"
import { Link } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"
import { useSongStore } from "../store/song-store"
import { Optional, Song } from "../types"
import usePlaySong from "./use-play-song"
import useRandomCoverGradient from "./use-random-cover-gradient"

// TODO : Needs testing with localStorage, like when its full etc.
// TODO : Since cover is passed in as a string it can be anything, should validate it, if wrong then generate a new one
// use-import-songs already has validation for parsing cover
export default function useCreateSong() {
    const addSong = useSongStore.use.addSong()
    const playSong = usePlaySong()
    const { toast } = useToast()
    const { cover, generateRandomCover } = useRandomCoverGradient()

    return (song: Optional<Song, "id" | "cover" | "completion" | "createdAt" | "lastModifiedAt" | "record" | "spotifyUri">) => {
        const newSong: Song = {
            ...song,
            content: song.content.replace(/\s{2,}/g, " "), // remove multiple whitespaces in a row, replace with a single whitespace
            id: song.id ?? uuidv4(),
            cover: song.cover ?? JSON.stringify(cover),
            completion: song.completion ?? 0,
            createdAt: song.createdAt ?? Date.now(),
            lastModifiedAt: song.lastModifiedAt ?? Date.now(),
            record: song.record ?? { wpm: 0, accuracy: 0 },
            spotifyUri: song.spotifyUri,
        }

        try {
            addSong(newSong)

            toast({
                title: "Successfully added your song.",
                description: `${newSong.title} - ${newSong.source}`,
                variant: "success",
                action: (
                    <div className="space-x-1">
                        <Button
                            variant={"outline"}
                            size={"icon"}
                            onClick={() => {
                                playSong(newSong.id)
                            }}
                        >
                            <PlayIcon />
                        </Button>
                        <Link to={`/songs/${newSong.id}`}>
                            <Button variant={"outline"}>View</Button>
                        </Link>
                    </div>
                ),
            })

            // TODO : I don't like how this is done, it doesn't seem right
            generateRandomCover()
        } catch (e) {
            // TODO : This is untested
            toast({
                title: "Failed to add song.",
                description: `It seems like storage is full or this song is too long. ${
                    JSON.stringify(localStorage).length
                }storage size ${JSON.stringify(newSong).length}`,
                variant: "destructive",
            })
        }

        return true
    }
}

import { useSongStore } from "@/lib/store/song-store.tsx"
import usePlaySong from "@/lib/hooks/use-play-song.tsx"
import { useToast } from "@/components/ui/use-toast.ts"
import { Song } from "@/lib/types.ts"
import { removeMultipleWhitespacesInARow } from "@/lib/utils.ts"
import { v4 as uuidv4 } from "uuid"
import { createRandomCover } from "@/lib/gradient.ts"
import { Button } from "@/components/ui/button.tsx"
import { PlayIcon } from "@radix-ui/react-icons"
import { Link } from "react-router-dom"

export const useUpsertSong = () => {
    const upsertSong = useSongStore.use.upsertSong()
    const playSong = usePlaySong()
    const { toast } = useToast()

    return (song: Required<Pick<Song, "title" | "content" | "source">> & Partial<Omit<Song, "title" | "content" | "source">>) => {
        try {
            const id = song.id ?? uuidv4()

            upsertSong({
                ...song,
                content: removeMultipleWhitespacesInARow(song.content),
                id: id,
                cover: song.cover ?? JSON.stringify(createRandomCover()),
                completion: song.completion ?? 0,
                createdAt: song.createdAt ?? Date.now(),
                lastModifiedAt: song.lastModifiedAt ?? Date.now(),
                record: song.record ?? { wpm: 0, accuracy: 0 },
                spotifyUri: song.spotifyUri,
                spotifyCover: song.spotifyCover,
            })

            toast({
                title: "Successfully added your song.",
                description: `${song.title} - ${song.source}`,
                variant: "success",
                action: (
                    <div className="space-x-1">
                        <Button
                            variant={"outline"}
                            size={"icon"}
                            onClick={() => {
                                playSong(id)
                            }}
                        >
                            <PlayIcon />
                        </Button>
                        <Link to={`/songs/${id}`}>
                            <Button variant={"outline"}>View</Button>
                        </Link>
                    </div>
                ),
            })

            return true
        } catch (e) {
            // TODO : This is untested
            toast({
                title: "Failed to add song.",
                // description: `It seems like storage is full or this song is too long. ${
                //     JSON.stringify(localStorage).length
                // }storage size ${JSON.stringify(song).length}`,
                variant: "destructive",
            })
            return false
        }
    }
}

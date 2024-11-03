import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { PlayIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useSongStore } from "../store/song-store";
import { Optional, Song } from "../types";
import { generateGradient } from "../utils";
import usePlaySong from "./use-play-song";

// TODO : Needs testing with localStorage, like when its full etc.
export default function useCreateSong() {
    const addSong = useSongStore.use.addSong();
    const playSong = usePlaySong();
    const { toast } = useToast();

    return (
        song: Optional<
            Song,
            | "id"
            | "cover"
            | "completion"
            | "createdAt"
            | "lastModifiedAt"
            | "record"
            | "spotifyUri"
        >
    ) => {
        const newSong: Song = {
            ...song,
            id: song.id ?? uuidv4(),
            cover: song.cover ?? generateGradient(),
            completion: song.completion ?? 0,
            createdAt: song.createdAt ?? Date.now(),
            lastModifiedAt: song.lastModifiedAt ?? Date.now(),
            record: song.record ?? { wpm: 0, accuracy: 0 },
            spotifyUri: song.spotifyUri,
        };

        try {
            addSong(newSong);

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
                                playSong(newSong.id);
                            }}
                        >
                            <PlayIcon />
                        </Button>
                        <Link to={`/songs/${newSong.id}`}>
                            <Button variant={"outline"}>View</Button>
                        </Link>
                    </div>
                ),
            });
        } catch (e) {
            // TODO : This is untested
            toast({
                title: "Failed to add song.",
                description: `It seems like storage is full or this song is too long. ${
                    JSON.stringify(localStorage).length
                }storage size ${JSON.stringify(newSong).length}`,
                variant: "destructive",
            });
        }

        return true;
    };
}

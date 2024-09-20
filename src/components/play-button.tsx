import React from "react";
import { Button } from "./ui/button";
import { PlayIcon } from "@radix-ui/react-icons";
import { useUiStateStore } from "@/lib/store/ui-state-store";
import { useQueueStore } from "@/lib/store/queue-store";
import MusicPlaying from "./music-playing";
import { useLocation, useNavigate } from "react-router-dom";

export default function PlayButton({ songID }: { songID: string }) {
    const navigate = useNavigate();
    const location = useLocation();

    const songs = useQueueStore.use.songs();
    const enqueue = useQueueStore.use.enqueue();
    const current = useQueueStore.use.current();
    const setCurrent = useQueueStore.use.setCurrent();

    const onPlay = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        songId: string
    ) => {
        e.stopPropagation();
        if (!songs.includes(songId)) {
            // TODO : Should enqueue the song at the top of the queue if no current
            // Otherwise enqueue after current
            enqueue(songId, true);
        } else {
            setCurrent(songId);
        }

        if (location.pathname != "/") {
            navigate("/");
        }
    };

    return (
        <Button
            onClick={(e) => onPlay(e, songID)}
            size={"icon"}
            className="rounded-full hover:bg-background hover:text-foreground"
            variant={"ghost"}
        >
            {current == songID && <MusicPlaying />}
            {current != songID && <PlayIcon className="w-5 h-5" />}
        </Button>
    );
}

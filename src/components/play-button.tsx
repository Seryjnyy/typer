import React from "react";
import { Button } from "./ui/button";
import { PlayIcon } from "@radix-ui/react-icons";
import { useUiStateStore } from "@/lib/store/ui-state-store";
import { useQueueStore } from "@/lib/store/queue-store";
import MusicPlaying from "./music-playing";
import { useNavigate } from "react-router-dom";

export default function PlayButton({ songID }: { songID: string }) {
    const navigate = useNavigate();

    const songs = useQueueStore.use.songs();
    const enqueue = useQueueStore.use.enqueue();
    const current = useQueueStore.use.current();
    const setCurrent = useQueueStore.use.setCurrent();
    console.log(current);

    const onPlay = (songId: string) => {
        if (!songs.includes(songId)) {
            enqueue(songId, true);
        } else {
            setCurrent(songId);
        }

        navigate("/");
    };

    return (
        <Button
            onClick={() => onPlay(songID)}
            size={"icon"}
            className="rounded-full hover:bg-background hover:text-foreground"
            variant={"ghost"}
        >
            {current == songID && <MusicPlaying />}
            {current != songID && <PlayIcon className="w-5 h-5" />}
        </Button>
    );
}

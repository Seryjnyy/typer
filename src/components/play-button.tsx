import React from "react";
import { Button } from "./ui/button";
import { PlayIcon } from "@radix-ui/react-icons";
import { useUiStateStore } from "@/lib/store/ui-state-store";
import { useQueueStore } from "@/lib/store/queue-store";
import MusicPlaying from "./music-playing";

export default function PlayButton({ songID }: { songID: string }) {
    const uiState = useUiStateStore();

    const queue = useQueueStore();

    const onPlay = (songId: string) => {
        if (!queue.songs.includes(songId)) {
            queue.enqueue(songId);
        } else {
            queue.setCurrent(songId);
        }

        if (uiState.currentWindow != "typer") {
            uiState.setCurrentWindow("typer");
        }
    };

    return (
        <Button
            onClick={() => onPlay(songID)}
            size={"icon"}
            className="rounded-full hover:bg-background hover:text-foreground"
            variant={"ghost"}
        >
            {queue.current == songID && <MusicPlaying />}
            {queue.current != songID && <PlayIcon className="w-5 h-5" />}
        </Button>
    );
}

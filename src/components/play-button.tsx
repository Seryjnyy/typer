import React from "react";
import { Button } from "./ui/button";
import { PlayIcon } from "@radix-ui/react-icons";
import { useUiStateStore } from "@/lib/store/ui-state-store";
import { useQueueStore } from "@/lib/store/queue-store";
import MusicPlaying from "./music-playing";
import { useLocation, useNavigate } from "react-router-dom";
import usePlaySong from "@/lib/hooks/use-play-song";

export default function PlayButton({ songID }: { songID: string }) {
    const playSong = usePlaySong();
    const current = useQueueStore.use.current();

    const onPlay = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        playSong(songID);
    };

    return (
        <Button
            onClick={(e) => onPlay(e)}
            size={"icon"}
            className="rounded-full hover:bg-background hover:text-foreground"
            variant={"ghost"}
        >
            {current == songID && <MusicPlaying />}
            {current != songID && <PlayIcon className="w-5 h-5" />}
        </Button>
    );
}

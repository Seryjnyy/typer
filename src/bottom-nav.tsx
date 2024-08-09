import { Progress } from "@/components/ui/progress";

import {
    CaretDownIcon,
    CaretUpIcon,
    CheckIcon,
    DividerHorizontalIcon,
    DividerVerticalIcon,
    LoopIcon,
    PauseIcon,
    PlayIcon,
    ShuffleIcon,
    SlashIcon,
} from "@radix-ui/react-icons";
import { useMemo } from "react";
import { Button } from "./components/ui/button";
import { useQueueStore } from "./lib/store/queue-store";
import { useSongStore } from "./lib/store/song-store";
import QueueControl from "./queue-control";
import WindowControls from "./window-controls";
import { useUiStateStore } from "./lib/store/ui-state-store";
import { ModeToggle } from "./components/mode-toggle";
import { useSongProgressStore } from "./lib/store/song-progress-store";
import MusicPlaying from "./components/music-playing";
import AutoplayButton from "./components/autoplay-button";
import { cn } from "./lib/utils";

const MediaControl = () => {
    const uiState = useUiStateStore();

    // TODO : might need to force rerender window
    const onPlaySong = () => {
        if (uiState.currentWindow != "typer") {
            uiState.setCurrentWindow("typer");
        }
    };

    return (
        <div className="flex">
            <Button variant={"ghost"} size={"icon"}>
                <ShuffleIcon />
            </Button>
            <QueueControl>
                <Button
                    onClick={onPlaySong}
                    size={"icon"}
                    className="rounded-full"
                >
                    <PlayIcon />
                </Button>
            </QueueControl>
            <Button variant={"ghost"} size={"icon"}>
                <LoopIcon />
            </Button>
        </div>
    );
};

const SongProgressStats = () => {
    const songProgress = useSongProgressStore();
    const queue = useQueueStore();
    return (
        <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">
                {songProgress.songTypedChar}/{songProgress.songTotalChar}
            </span>
            <span className="text-xs text-muted-foreground">
                {songProgress.timeElapsed}s
            </span>
            <div className="border rounded-full">
                {!songProgress.completed && queue.current != null && (
                    <DividerVerticalIcon className="w-3 h-3 animate-spin" />
                )}
                {songProgress.completed && <CheckIcon />}
                {/* {!songProgress.completed && queue.current == null && (
                            <DividerHorizontalIcon />
                        )} */}
            </div>
        </div>
    );
};

const SongInfo = () => {
    const queue = useQueueStore();
    const songList = useSongStore.use.songs();

    const songData = useMemo(() => {
        return songList.find((x) => x.id == queue.current);
    }, [queue.current, songList]);

    return (
        <div className="flex flex-col max-w-[12rem]">
            <div className="flex gap-2">
                <div
                    className={cn(
                        "h-12 w-12 rounded-md",
                        songData?.cover
                        // "bg-gradient-to-bl from-yellow-200 to-violet-800"
                    )}
                ></div>
                <div className="flex flex-col">
                    <span className="text-ellipsis overflow-hidden">
                        {songData?.title}
                    </span>
                    <span className="text-muted-foreground text-sm text-ellipsis overflow-hidden">
                        {songData?.source}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default function BottomNav() {
    const uiState = useUiStateStore();

    const songProgress = useSongProgressStore();

    const onToggleQueueWindow = () => {
        uiState.setQueueWindowOpen(!uiState.queueWindowOpen);
    };

    if (uiState.focus) return <></>;

    return (
        <div className="w-full  flex flex-col justify-start border gap-2 h-full">
            <Progress
                value={
                    (songProgress.songTypedChar / songProgress.songTotalChar) *
                    100
                }
                className="w-full h-1"
            />
            <div className="px-3 h-full grid-cols-3 grid w-full">
                <div className="w-fit">
                    <SongInfo />
                </div>
                <div className="flex items-center gap-2 h-full  justify-center flex-col">
                    <MediaControl />

                    {/* <SongProgressStats /> */}
                </div>
                <div className="flex gap-8 items-center  justify-end">
                    <WindowControls />
                    <Button
                        size={"icon"}
                        onClick={onToggleQueueWindow}
                        variant={"ghost"}
                    >
                        {!uiState.queueWindowOpen && <CaretUpIcon />}
                        {uiState.queueWindowOpen && <CaretDownIcon />}
                    </Button>
                </div>
            </div>
        </div>
    );
}

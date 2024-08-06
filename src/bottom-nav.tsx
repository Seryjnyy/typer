import { Progress } from "@/components/ui/progress";

import {
    CaretDownIcon,
    CaretUpIcon,
    CheckIcon,
    DividerHorizontalIcon,
    DividerVerticalIcon,
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

export default function BottomNav() {
    const uiState = useUiStateStore();
    const queue = useQueueStore();
    const songList = useSongStore.use.songs();
    const songProgress = useSongProgressStore();

    const songData = useMemo(() => {
        return songList.find((x) => x.id == queue.current);
    }, [queue.current, songList]);

    const onToggleQueueWindow = () => {
        uiState.setQueueWindowOpen(!uiState.queueWindowOpen);
    };

    // TODO : might need to force rerender window
    const onPlaySong = () => {
        if (uiState.currentWindow != "typer") {
            uiState.setCurrentWindow("typer");
        }
    };

    return (
        <div className="w-full  flex flex-col justify-start border gap-2 h-full">
            <Progress
                value={
                    (songProgress.songTypedChar / songProgress.songTotalChar) *
                    100
                }
                className="w-full h-1"
            />
            <div className="flex justify-between px-3 h-full items-center">
                <div className="flex items-center gap-2 h-full">
                    <QueueControl>
                        <Button
                            onClick={onPlaySong}
                            size={"icon"}
                            className="rounded-full"
                        >
                            <PlayIcon />
                        </Button>
                    </QueueControl>
                    <span className="text-xs text-muted-foreground">
                        {songProgress.songTypedChar}/
                        {songProgress.songTotalChar}
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
                <div className="flex flex-col max-w-[12rem]">
                    <span className="text-ellipsis overflow-hidden">
                        {songData?.title}
                    </span>
                    <span className="text-muted-foreground text-sm text-ellipsis overflow-hidden">
                        {songData?.source}
                    </span>
                </div>
                <div className="flex gap-8">
                    <div className="flex items-center gap-2">
                        <Button>
                            <ShuffleIcon />
                        </Button>
                        <Button variant={"outline"}>
                            {/* <div className=" flex gap-2  rounded-md">
              <div className="bg-card p-1 rounded-lg">
                <PauseIcon className="text-card-foreground" />
              </div>
              <div className="bg-card p-1 rounded-lg border">
                <PlayIcon className="text-card-foreground  " />
              </div>
            </div> */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs">auto</span>{" "}
                                <PlayIcon />
                            </div>
                        </Button>
                    </div>
                    <ModeToggle />
                    <WindowControls />
                    <Button size={"icon"} onClick={onToggleQueueWindow}>
                        {!uiState.queueWindowOpen && <CaretUpIcon />}
                        {uiState.queueWindowOpen && <CaretDownIcon />}
                    </Button>
                </div>
            </div>
        </div>
    );
}

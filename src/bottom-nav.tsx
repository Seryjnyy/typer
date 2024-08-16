import { Progress } from "@/components/ui/progress";

import {
    CaretDownIcon,
    CaretUpIcon,
    CheckIcon,
    DividerVerticalIcon,
    LoopIcon,
    PlayIcon,
    ShuffleIcon,
} from "@radix-ui/react-icons";
import { useMemo } from "react";
import { Button } from "./components/ui/button";
import { useQueueStore } from "./lib/store/queue-store";
import { useSongProgressStore } from "./lib/store/song-progress-store";
import { useSongStore } from "./lib/store/song-store";
import { useUiStateStore } from "./lib/store/ui-state-store";
import { cn } from "./lib/utils";
import QueueControl from "./queue-control";
import WindowControls from "./window-controls";
import ShuffleButton from "./components/shuffle-button";
import {
    SongBanner,
    SongDetail,
    SongHeader,
} from "./components/ui/song-header";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const MediaControl = () => {
    const uiState = useUiStateStore();

    // TODO : might need to force rerender window
    const onPlaySong = () => {
        if (uiState.currentWindow != "typer") {
            uiState.setCurrentWindow("typer");
        }
    };

    return (
        <div className="flex items-center gap-3">
            <ShuffleButton variant={"ghost"} size={"icon"} />
            <QueueControl>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            onClick={onPlaySong}
                            size={"icon"}
                            className="rounded-full"
                        >
                            <PlayIcon className="w-5 h-5" />
                        </Button>
                    </TooltipTrigger>

                    <TooltipContent>
                        <p>Play</p>
                    </TooltipContent>
                </Tooltip>
            </QueueControl>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant={"ghost"} size={"icon"}>
                        <LoopIcon />
                    </Button>
                </TooltipTrigger>

                <TooltipContent>
                    <p>Loop</p>
                </TooltipContent>
            </Tooltip>
        </div>
    );
};

const SongProgressStats = () => {
    const songProgress = useSongProgressStore();
    const queue = useQueueStore();
    return (
        <div className="flex items-center gap-1">
            {/* <span className="text-xs text-muted-foreground">
                {songProgress.songTypedChar}/{songProgress.songTotalChar}
            </span>
            <span className="text-xs text-muted-foreground">
                {songProgress.timeElapsed}s
            </span> */}
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
            {songData && (
                <SongHeader>
                    <SongBanner song={songData} />
                    <SongDetail
                        length={"long"}
                        song={songData}
                        isCurrent={songData.id == queue.current}
                    />
                </SongHeader>
            )}
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
        <div className="w-full  flex flex-col justify-start border  h-full ">
            <Progress
                value={
                    (songProgress.songTypedChar / songProgress.songTotalChar) *
                    100
                }
                className="w-full h-1"
            />
            <div className="px-3 h-full grid-cols-3 grid w-full bg-background  pt-1">
                <div className="w-fit flex gap-9">
                    <SongInfo />
                    <SongProgressStats />
                </div>
                <div className="flex items-center gap-2 h-full  justify-center flex-col">
                    <MediaControl />
                </div>
                <div className="flex gap-8 items-center  justify-end">
                    <WindowControls />
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size={"icon"}
                                onClick={onToggleQueueWindow}
                                variant={"ghost"}
                            >
                                {uiState.queueWindowOpen ? (
                                    <CaretDownIcon />
                                ) : (
                                    <CaretUpIcon />
                                )}
                            </Button>
                        </TooltipTrigger>

                        <TooltipContent>
                            <p>
                                {uiState.queueWindowOpen
                                    ? "Close queue"
                                    : "Open queue"}
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
}

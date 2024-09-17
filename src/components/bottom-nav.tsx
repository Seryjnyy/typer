import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Progress } from "@/components/ui/progress";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    CaretDownIcon,
    CaretUpIcon,
    CheckIcon,
    DividerVerticalIcon,
    PlayIcon,
} from "@radix-ui/react-icons";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueueStore } from "../lib/store/queue-store";
import { useSongProgressStore } from "../lib/store/song-progress-store";
import { useSongStore } from "../lib/store/song-store";
import { useUiStateStore } from "../lib/store/ui-state-store";
import { cn } from "../lib/utils";
import LoopButton from "./loop-button";
import { MobileQueue } from "./queue";
import QueueControl from "./queue-control";
import ShuffleButton from "./shuffle-button";
import { Button } from "./ui/button";
import { SongBanner, SongDetail, SongHeader } from "./ui/song-header";
import WindowControls from "./window-controls";

const MediaControl = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const current = useQueueStore.use.current();
    const setCurrent = useQueueStore.use.setCurrent();

    const songs = useQueueStore.use.songs();

    // TODO : might need to force rerender window
    const onPlaySong = () => {
        // Route to typer if not on typer page
        if (location.pathname != "/") {
            navigate("/");
        }

        // If there is no current song but there are songs in the queue then play the first one
        if (!current) {
            if (songs.length > 0) {
                setCurrent(songs[0]);
            }
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
                            className="rounded-full w-11 h-11"
                        >
                            <PlayIcon className="w-6 h-6" />
                        </Button>
                    </TooltipTrigger>

                    <TooltipContent>
                        <p>Play</p>
                    </TooltipContent>
                </Tooltip>
            </QueueControl>
            <LoopButton />
        </div>
    );
};

const SongProgressStats = () => {
    const completed = useSongProgressStore.use.completed();
    const current = useQueueStore.use.current();

    return (
        <div className="flex items-center gap-1">
            {/* <span className="text-xs text-muted-foreground">
                {songProgress.songTypedChar}/{songProgress.songTotalChar}
            </span>
            <span className="text-xs text-muted-foreground">
                {songProgress.timeElapsed}s
            </span> */}
            <div className="border rounded-full">
                {!completed && current != null && (
                    <DividerVerticalIcon className="w-3 h-3 animate-spin" />
                )}
                {completed && <CheckIcon />}
                {/* {!songProgress.completed && queue.current == null && (
                            <DividerHorizontalIcon />
                        )} */}
            </div>
        </div>
    );
};

const SongInfo = () => {
    const current = useQueueStore.use.current();
    const songList = useSongStore.use.songs();

    const songData = useMemo(() => {
        return songList.find((x) => x.id == current);
    }, [current, songList]);

    return (
        <div className="flex flex-col max-w-[12rem]">
            {songData && (
                <SongHeader>
                    <SongBanner song={songData} />
                    <SongDetail
                        length={"long"}
                        song={songData}
                        isCurrent={songData.id == current}
                    />
                </SongHeader>
            )}
        </div>
    );
};

const MobileMenu = ({ className }: { className?: string }) => {
    const currSong = useQueueStore.use.current();
    const song = useSongStore.use.songs().find((x) => x.id == currSong);

    const focus = useUiStateStore.use.focus();
    const songTypedChar = useSongProgressStore.use.songTypedChar();
    const songTotalChar = useSongProgressStore.use.songTotalChar();
    const [openQueue, setOpenQueue] = useState(false);

    if (focus) return null;

    const from = song?.cover.split(" ")[1];
    const to = song?.cover.split(" ")[2];

    return (
        <div
            className={cn(
                "w-full  flex flex-col justify-start   h-full bg-background",
                className
            )}
        >
            <div className={cn("w-full relative h-full ")}>
                <div
                    className={`h-14 w-full absolute -top-16 left-0 backdrop-blur-xl`}
                >
                    <Drawer>
                        <DrawerTrigger className="w-full h-full px-2 flex items-center justify-between border-y ">
                            <div className="w-fit flex gap-2 md:gap-9">
                                <SongInfo />
                                <SongProgressStats />
                            </div>
                            {/* <div className="w-[10rem]">
                                <Progress
                                    value={
                                        (songTypedChar / songTotalChar) * 100
                                    }
                                    className="w-full h-1"
                                />
                            </div> */}
                            <CaretUpIcon />
                        </DrawerTrigger>

                        <DrawerContent
                            className={cn(
                                "flex flex-col  ",
                                openQueue ? "h-[90vh]" : "h-[50vh] ",
                                from && `bg-gradient-to-b ${from} `
                            )}
                        >
                            {/* <DrawerHeader>
                                <DrawerTitle className="sr-only">
                                    Extra details and queue card.
                                </DrawerTitle>
                            </DrawerHeader> */}

                            <div className="space-y-2 mt-auto backdrop-brightness-50 pt-4 rounded-t-md">
                                <div className="mx-2 sm:mx-12">
                                    <div className="w-fit flex md:gap-9">
                                        <SongInfo />
                                        <SongProgressStats />
                                    </div>
                                </div>
                                <div className="flex justify-center flex-col items-center gap-4 px-2 sm:mx-12">
                                    <Progress
                                        value={
                                            (songTypedChar / songTotalChar) *
                                            100
                                        }
                                        className="w-full h-1"
                                    />
                                    <MediaControl />
                                </div>
                                {/* <div className="flex justify-end p-1">
                                    <Button
                                        variant={"ghost"}
                                        onClick={() =>
                                            setOpenQueue((prev) => !prev)
                                        }
                                    >
                                        {openQueue ? "Close" : "Open"} queue
                                    </Button>
                                </div> */}
                                <Collapsible
                                    open={openQueue}
                                    onOpenChange={(val) => setOpenQueue(val)}
                                >
                                    <CollapsibleTrigger className="flex justify-between items-center w-full px-2 py-2 text-sm font-medium">
                                        {openQueue ? (
                                            <CaretUpIcon className="text-muted-foreground" />
                                        ) : (
                                            <CaretDownIcon className="text-muted-foreground" />
                                        )}
                                        <span>Open queue</span>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="h-[60vh] ">
                                        <MobileQueue />
                                    </CollapsibleContent>
                                </Collapsible>
                            </div>
                        </DrawerContent>
                    </Drawer>
                </div>

                <div className="w-full h-full">
                    <WindowControls variant={"square"} />
                </div>
            </div>
        </div>
    );
};

// TODO : conditionally render mobile/pc menu
export default function BottomNav() {
    const queueWindowOpen = useUiStateStore.use.queueWindowOpen();
    const focus = useUiStateStore.use.focus();
    const setQueueWindowOpen = useUiStateStore.use.setQueueWindowOpen();
    const songTypedChar = useSongProgressStore.use.songTypedChar();
    const songTotalChar = useSongProgressStore.use.songTotalChar();

    const onToggleQueueWindow = () => {
        setQueueWindowOpen(!queueWindowOpen);
    };

    if (focus) return null;

    return (
        <div className="h-full">
            <MobileMenu className=" sm:hidden " />
            <div className="w-full flex-col justify-start   h-full hidden sm:flex ">
                <Progress
                    value={(songTypedChar / songTotalChar) * 100}
                    className="w-full h-1"
                />

                <div className="px-3 h-full grid-cols-3 grid w-full bg-background  pt-1 ">
                    <div className="w-fit flex gap-9">
                        <SongInfo />
                        <SongProgressStats />
                    </div>
                    <div className="flex items-center gap-2 h-full  justify-center flex-col">
                        <MediaControl />
                    </div>

                    <div className="flex gap-8 items-center  justify-end ">
                        <div className="w-[7rem] h-[2rem]">
                            <WindowControls />
                        </div>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size={"icon"}
                                    onClick={onToggleQueueWindow}
                                    variant={"ghost"}
                                >
                                    {queueWindowOpen ? (
                                        <CaretDownIcon />
                                    ) : (
                                        <CaretUpIcon />
                                    )}
                                </Button>
                            </TooltipTrigger>

                            <TooltipContent>
                                <p>
                                    {queueWindowOpen
                                        ? "Close queue"
                                        : "Open queue"}
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </div>
    );
}

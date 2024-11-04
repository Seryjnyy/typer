import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePreferenceStore } from "@/lib/store/preferences-store";
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
} from "@hello-pangea/dnd";
import { Cross1Icon, FileTextIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQueueStore } from "../lib/store/queue-store";
import { useSongStore } from "../lib/store/song-store";
import { useUiStateStore } from "../lib/store/ui-state-store";
import { cn, shuffleArray } from "../lib/utils";
import AutoplayButton from "./autoplay-button";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { SongBanner, SongDetail, SongHeader } from "./ui/song-header";
import { useSongCover } from "@/lib/hooks/use-song-cover";

// TODO : is this needed anywhere else?
const useQueue = () => {
    const queueSongsList = useQueueStore.use.songs();
    const setQueueSongsList = useQueueStore.use.setSongs();
    const removeSong = useQueueStore.use.removeSong();
    const currentID = useQueueStore.use.current();
    const enqueue = useQueueStore.use.enqueue();
    const setCurrent = useQueueStore.use.setCurrent();
    const setQueueSongs = useQueueStore.use.setSongs();

    const songList = useSongStore.use.songs();
    const queue = useMemo(() => {
        const res = queueSongsList.map((songId) =>
            songList.find((x) => x.id == songId)
        );

        return res.filter((x) => x != undefined);
    }, [queueSongsList, songList]);

    const removeFromQueue = (songId: string) => {
        removeSong(songId);
    };

    const clearQueue = () => {
        setQueueSongs([]);
    };

    const enqueueRandomSongs = () => {
        const randomSongs = shuffleArray(songList).slice(0, 5);

        randomSongs.forEach((song) => {
            enqueue(song.id);
        });
        if (randomSongs.length > 0) {
            setCurrent(randomSongs[0].id);
        }
    };

    const currentSong = useMemo(() => {
        return songList.find((x) => x.id == currentID);
    }, [songList, currentID]);

    return {
        queue,
        setQueue: setQueueSongsList,
        currentID,
        currentSong,
        removeFromQueue,
        clearQueue,
        enqueueRandomSongs,
        totalAvailableSongs: songList.length,
    };
};

export const MobileQueue = () => {
    const queueWindowOpen = useUiStateStore.use.queueWindowOpen();
    const focus = useUiStateStore.use.focus();
    const {
        queue,
        currentID,
        currentSong,
        clearQueue,
        enqueueRandomSongs,
        removeFromQueue,
        totalAvailableSongs,
    } = useQueue();

    const { coverAsBgGradientStyle } = useSongCover(currentSong);
    const isQueueColoured = usePreferenceStore.use.isQueueColour();

    if (queueWindowOpen || focus) return <></>;

    return (
        <div className="h-full rounded-t-sm    w-full overflow-hidden">
            <ScrollArea
                className=" h-[calc(100%)]  pl-1 pr-3 pb-1 border-t"
                style={isQueueColoured ? coverAsBgGradientStyle : undefined}
            >
                {queue.map((song, index) => (
                    <div
                        key={song.id}
                        className={cn(
                            "border p-4 rounded-md space-y-2 group mt-2 bg-transparent flex ",
                            isQueueColoured
                                ? currentID == song.id
                                    ? "backdrop-brightness-50"
                                    : "backdrop-brightness-75"
                                : currentID == song.id
                                ? "bg-secondary"
                                : ""
                        )}
                    >
                        <div
                            className={
                                "flex items-center " +
                                (currentID == song.id
                                    ? "text-foreground"
                                    : "text-muted")
                            }
                        >
                            <span className="">{index + 1}</span>
                        </div>
                        <SongHeader className="pl-3">
                            <SongBanner song={song} playButton />
                            <SongDetail
                                song={song}
                                isCurrent={song.id == currentID}
                            />
                        </SongHeader>
                        <div className="flex items-center">
                            <div className="flex justify-between">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            onClick={() =>
                                                removeFromQueue(song.id)
                                            }
                                            size={"icon"}
                                            variant={"ghost"}
                                        >
                                            <Cross1Icon />
                                        </Button>
                                    </TooltipTrigger>

                                    <TooltipContent>
                                        <p>Remove</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                ))}
                {queue.length == 0 && totalAvailableSongs > 0 && (
                    <div className="mt-4">
                        {/* TODO : doesn't close the drawer so you don't even know that it worked */}
                        {/* <Link to={"/songs"}>
                            <Button
                                className="w-full mt-1 text-xs text-muted-foreground gap-2 flex justify-start"
                                variant={"ghost"}
                                size={"sm"}
                                onClick={onClearQueue}
                            >
                                <FileTextIcon />
                                <span>View song list</span>
                            </Button>
                        </Link> */}
                        <Button
                            className="w-full mt-1 text-xs text-muted-foreground gap-2 flex justify-start"
                            variant={"ghost"}
                            size={"sm"}
                            onClick={enqueueRandomSongs}
                            disabled={totalAvailableSongs == 0}
                        >
                            <Icons.dice className="w-4 h-4" />
                            <span>Add random songs</span>
                        </Button>
                    </div>
                )}
                {queue.length > 0 && (
                    <Button
                        className="w-full mt-1 text-xs text-muted-foreground"
                        variant={"ghost"}
                        size={"sm"}
                        onClick={clearQueue}
                    >
                        Clear queue
                    </Button>
                )}
            </ScrollArea>
        </div>
    );
};

export default function Queue() {
    const isQueueColoured = usePreferenceStore.use.isQueueColour();
    const queueWindowOpen = useUiStateStore.use.queueWindowOpen();
    const focus = useUiStateStore.use.focus();

    const {
        queue,
        currentID,
        currentSong,
        clearQueue,
        enqueueRandomSongs,
        removeFromQueue,
        setQueue,
        totalAvailableSongs,
    } = useQueue();

    const { coverAsBgGradientStyle } = useSongCover(currentSong);

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const newArr = Array.from(queue);
        const [draggedItem] = newArr.splice(result.source.index, 1);
        newArr.splice(result.destination.index, 0, draggedItem);
        setQueue(newArr.map((x) => x.id));
    };

    if (!queueWindowOpen || focus) return <></>;

    return (
        <div
            className={cn(
                "h-full border rounded-md py-4  w-[15rem] overflow-hidden"
            )}
            style={isQueueColoured ? coverAsBgGradientStyle : undefined}
        >
            <div className="flex justify-between px-2 pb-2">
                <h3 className="font-semibold text-xl pl-1">Up next</h3>
                <AutoplayButton />
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="queue">
                    {(provided) => (
                        <ScrollArea
                            className=" h-[calc(100%-1.3rem)]    pl-1 pr-3 pb-1 border-t"
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {queue.map((song, index) => (
                                <Draggable
                                    draggableId={song.id}
                                    index={index}
                                    key={song.id}
                                >
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.dragHandleProps}
                                            {...provided.draggableProps}
                                            className={cn(
                                                "border p-4 rounded-md space-y-2 group mt-2 bg-transparent flex ",
                                                isQueueColoured
                                                    ? currentID == song.id
                                                        ? "backdrop-brightness-50"
                                                        : "backdrop-brightness-75"
                                                    : currentID == song.id
                                                    ? "bg-secondary"
                                                    : ""
                                            )}
                                        >
                                            <div
                                                className={
                                                    "flex items-center " +
                                                    (currentID == song.id
                                                        ? "text-foreground"
                                                        : "text-muted")
                                                }
                                            >
                                                <span className="">
                                                    {index + 1}
                                                </span>
                                            </div>
                                            <SongHeader className="pl-3">
                                                <SongBanner
                                                    song={song}
                                                    playButton
                                                />
                                                <SongDetail
                                                    song={song}
                                                    isCurrent={
                                                        song.id == currentID
                                                    }
                                                />
                                            </SongHeader>
                                            <div className="flex items-center">
                                                <div className="flex justify-between">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                onClick={() =>
                                                                    removeFromQueue(
                                                                        song.id
                                                                    )
                                                                }
                                                                size={"icon"}
                                                                variant={
                                                                    "ghost"
                                                                }
                                                            >
                                                                <Cross1Icon />
                                                            </Button>
                                                        </TooltipTrigger>

                                                        <TooltipContent>
                                                            <p>Remove</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                            {queue.length == 0 && (
                                <div className="mt-[72vh]">
                                    <Link to={"/songs"}>
                                        <Button
                                            className="w-full mt-1 text-xs text-muted-foreground gap-2 flex justify-start"
                                            variant={"ghost"}
                                            size={"sm"}
                                            onClick={clearQueue}
                                        >
                                            <FileTextIcon />
                                            <span>View song list</span>
                                        </Button>
                                    </Link>
                                    <Button
                                        className="w-full mt-1 text-xs text-muted-foreground gap-2 flex justify-start"
                                        variant={"ghost"}
                                        size={"sm"}
                                        onClick={enqueueRandomSongs}
                                        disabled={totalAvailableSongs == 0}
                                    >
                                        <Icons.dice className="w-4 h-4" />
                                        <span>Add random songs</span>
                                    </Button>
                                </div>
                            )}
                            {queue.length > 0 && (
                                <Button
                                    className="w-full mt-1 text-xs text-muted-foreground"
                                    variant={"ghost"}
                                    size={"sm"}
                                    onClick={clearQueue}
                                >
                                    Clear queue
                                </Button>
                            )}
                        </ScrollArea>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}

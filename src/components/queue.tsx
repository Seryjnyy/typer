import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
} from "@hello-pangea/dnd";
import { Cross1Icon, FileTextIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";
import PlayButton from "./play-button";
import { Button } from "./ui/button";
import { useQueueStore } from "../lib/store/queue-store";
import { useSongStore } from "../lib/store/song-store";
import { useUiStateStore } from "../lib/store/ui-state-store";
import { cn, shuffleArray } from "../lib/utils";
import AutoplayButton from "./autoplay-button";
import { SongHeader, SongBanner, SongDetail } from "./ui/song-header";
import { ScrollArea } from "./ui/scroll-area";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "./ui/use-toast";
import { Icons } from "./icons";
import { Link } from "react-router-dom";

export const MobileQueue = () => {
    const queueWindowOpen = useUiStateStore.use.queueWindowOpen();
    const focus = useUiStateStore.use.focus();

    const queueSongsList = useQueueStore.use.songs();
    const removeSong = useQueueStore.use.removeSong();
    const current = useQueueStore.use.current();
    const enqueue = useQueueStore.use.enqueue();
    const setQueueSongs = useQueueStore.use.setSongs();

    const songList = useSongStore.use.songs();
    const songs = useMemo(() => {
        const res = queueSongsList.map((songId) =>
            songList.find((x) => x.id == songId)
        );

        return res.filter((x) => x != undefined);
    }, [queueSongsList, songList]);

    const onRemoveFromQueue = (songId: string) => {
        removeSong(songId);
    };

    if (queueWindowOpen || focus) return <></>;

    const onClearQueue = () => {
        setQueueSongs([]);
    };

    const onAddRandomSongs = () => {
        const randomSongs = shuffleArray(songList).slice(0, 5);

        randomSongs.forEach((song) => {
            enqueue(song.id, true);
        });
    };
    return (
        <div className="h-full    w-full ">
            <ScrollArea className=" h-[calc(100%)]  pl-1 pr-3 pb-1 border-t">
                {songs.map((song, index) => (
                    <div
                        className={cn(
                            "border p-4 rounded-md space-y-2 group mt-2 bg-background flex",
                            {
                                "bg-secondary ": current == song.id,
                            }
                        )}
                    >
                        <div
                            className={
                                "flex items-center " +
                                (current == song.id
                                    ? "text-foreground"
                                    : "text-muted")
                            }
                        >
                            <span className="">{index + 1}</span>
                        </div>
                        <SongHeader className="pl-3">
                            <SongBanner song={song} />
                            <SongDetail
                                song={song}
                                isCurrent={song.id == current}
                            />
                        </SongHeader>
                        <div className="flex items-center">
                            <div className="flex justify-between">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            onClick={() =>
                                                onRemoveFromQueue(song.id)
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
                {songs.length == 0 && queueSongsList.length > 0 && (
                    <div>
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
                            onClick={onAddRandomSongs}
                        >
                            <Icons.dice className="w-4 h-4" />
                            <span>Add random songs</span>
                        </Button>
                    </div>
                )}
                {songs.length > 0 && (
                    <Button
                        className="w-full mt-1 text-xs text-muted-foreground"
                        variant={"ghost"}
                        size={"sm"}
                        onClick={onClearQueue}
                    >
                        Clear queue
                    </Button>
                )}
            </ScrollArea>
        </div>
    );
};

export default function Queue() {
    const queueWindowOpen = useUiStateStore.use.queueWindowOpen();
    const focus = useUiStateStore.use.focus();

    const queueSongsList = useQueueStore.use.songs();
    const removeSong = useQueueStore.use.removeSong();
    const current = useQueueStore.use.current();
    const setSongs = useQueueStore.use.setSongs();
    const enqueue = useQueueStore.use.enqueue();
    const setQueueSongs = useQueueStore.use.setSongs();

    const songList = useSongStore.use.songs();
    const songs = useMemo(() => {
        const res = queueSongsList.map((songId) =>
            songList.find((x) => x.id == songId)
        );

        return res.filter((x) => x != undefined);
    }, [queueSongsList, songList]);

    const onRemoveFromQueue = (songId: string) => {
        removeSong(songId);
    };

    if (!queueWindowOpen || focus) return <></>;

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const newArr = Array.from(songs);
        const [draggedItem] = newArr.splice(result.source.index, 1);
        newArr.splice(result.destination.index, 0, draggedItem);
        setSongs(newArr.map((x) => x.id));
    };

    const onClearQueue = () => {
        setQueueSongs([]);
    };

    const onAddRandomSongs = () => {
        const randomSongs = shuffleArray(songList).slice(0, 5);

        randomSongs.forEach((song) => {
            enqueue(song.id, true);
        });
    };

    return (
        <div className="h-full border rounded-md py-4  w-[15rem] ">
            <div className="flex justify-between px-2 pb-2">
                <h3 className="font-semibold text-xl pl-1">Up next</h3>
                <AutoplayButton />
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                {/* <ScrollArea className="h-full w-[250px]  "> */}
                <Droppable droppableId="queue">
                    {(provided) => (
                        <ScrollArea
                            className=" h-[calc(100%-1rem)]  pl-1 pr-3 pb-1 border-t"
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {songs.map((song, index) => (
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
                                                "border p-4 rounded-md space-y-2 group mt-2 bg-background flex",
                                                {
                                                    "bg-secondary ":
                                                        current == song.id,
                                                }
                                            )}
                                        >
                                            <div
                                                className={
                                                    "flex items-center " +
                                                    (current == song.id
                                                        ? "text-foreground"
                                                        : "text-muted")
                                                }
                                            >
                                                <span className="">
                                                    {index + 1}
                                                </span>
                                            </div>
                                            <SongHeader className="pl-3">
                                                <SongBanner song={song} />
                                                <SongDetail
                                                    song={song}
                                                    isCurrent={
                                                        song.id == current
                                                    }
                                                />
                                            </SongHeader>
                                            <div className="flex items-center">
                                                <div className="flex justify-between">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                onClick={() =>
                                                                    onRemoveFromQueue(
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
                            {songs.length == 0 && (
                                <div className="mt-[72vh]">
                                    <Link to={"/songs"}>
                                        <Button
                                            className="w-full mt-1 text-xs text-muted-foreground gap-2 flex justify-start"
                                            variant={"ghost"}
                                            size={"sm"}
                                            onClick={onClearQueue}
                                        >
                                            <FileTextIcon />
                                            <span>View song list</span>
                                        </Button>
                                    </Link>
                                    <Button
                                        className="w-full mt-1 text-xs text-muted-foreground gap-2 flex justify-start"
                                        variant={"ghost"}
                                        size={"sm"}
                                        onClick={onAddRandomSongs}
                                    >
                                        <Icons.dice className="w-4 h-4" />
                                        <span>Add random songs</span>
                                    </Button>
                                </div>
                            )}
                            {songs.length > 0 && (
                                <Button
                                    className="w-full mt-1 text-xs text-muted-foreground"
                                    variant={"ghost"}
                                    size={"sm"}
                                    onClick={onClearQueue}
                                >
                                    Clear queue
                                </Button>
                            )}
                        </ScrollArea>
                    )}
                </Droppable>
                {/* </ScrollArea> */}
            </DragDropContext>
        </div>
    );
}

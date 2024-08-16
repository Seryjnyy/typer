import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
} from "@hello-pangea/dnd";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useMemo } from "react";
import PlayButton from "./components/play-button";
import { Button } from "./components/ui/button";
import { useQueueStore } from "./lib/store/queue-store";
import { useSongStore } from "./lib/store/song-store";
import { useUiStateStore } from "./lib/store/ui-state-store";
import { cn } from "./lib/utils";
import AutoplayButton from "./components/autoplay-button";
import {
    SongHeader,
    SongBanner,
    SongDetail,
} from "./components/ui/song-header";
import { ScrollArea } from "./components/ui/scroll-area";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Queue() {
    const uiState = useUiStateStore();

    const queue = useQueueStore();
    const songList = useSongStore.use.songs();
    const songs = useMemo(() => {
        const res = queue.songs.map((songId) =>
            songList.find((x) => x.id == songId)
        );

        return res.filter((x) => x != undefined);
    }, [queue.songs, songList]);

    const onRemoveFromQueue = (songId: string) => {
        queue.removeSong(songId);
        console.log(queue.songs);
    };

    if (!uiState.queueWindowOpen || uiState.focus) return <></>;

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const newArr = Array.from(songs);
        const [draggedItem] = newArr.splice(result.source.index, 1);
        newArr.splice(result.destination.index, 0, draggedItem);
        queue.setSongs(newArr.map((x) => x.id));
    };

    return (
        <div className="h-full border py-4  w-[15rem]">
            <div className="flex justify-between px-2">
                <h3 className="font-semibold">Up next</h3>
                <AutoplayButton />
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                {/* <ScrollArea className="h-full w-[250px]  "> */}
                <Droppable droppableId="queue">
                    {(provided) => (
                        <ScrollArea
                            className=" h-[calc(100%-1rem)] pl-1 pr-3 pb-1"
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
                                                    "bg-secondary":
                                                        queue.current ==
                                                        song.id,
                                                }
                                            )}
                                        >
                                            <div
                                                className={
                                                    "flex items-center " +
                                                    (queue.current == song.id
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
                                                        song.id == queue.current
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
                        </ScrollArea>
                    )}
                </Droppable>
                {/* </ScrollArea> */}
            </DragDropContext>
        </div>
    );
}

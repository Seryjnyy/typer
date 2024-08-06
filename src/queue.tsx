import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
} from "@hello-pangea/dnd";
import { Cross1Icon, PlayIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";
import { Button } from "./components/ui/button";
import { ScrollArea } from "./components/ui/scroll-area";
import { useQueueStore } from "./lib/store/queue-store";
import { useSongStore } from "./lib/store/song-store";
import { cn } from "./lib/utils";
import { useUiStateStore } from "./lib/store/ui-state-store";
import PlayButton from "./components/play-button";
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

    const onPlay = (songId: string) => {
        queue.setCurrent(songId);
        if (uiState.currentWindow != "typer") {
            uiState.setCurrentWindow("typer");
        }
    };

    if (!uiState.queueWindowOpen) return <></>;

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const newArr = Array.from(songs);
        const [draggedItem] = newArr.splice(result.source.index, 1);
        newArr.splice(result.destination.index, 0, draggedItem);
        queue.setSongs(newArr.map((x) => x.id));
    };

    return (
        <div className="h-full border py-4 px-2 ">
            <h3 className="font-semibold">Up next</h3>
            <div className="w-[14rem]">
                <DragDropContext onDragEnd={onDragEnd}>
                    {/* <ScrollArea className="h-full w-[250px]  "> */}
                    <Droppable droppableId="so">
                        {(provided) => (
                            <div
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
                                                    "border p-4 rounded-md space-y-2 group mt-2",
                                                    {
                                                        "bg-secondary":
                                                            queue.current ==
                                                            song.id,
                                                    }
                                                )}
                                            >
                                                <div className="flex flex-col leading-tight">
                                                    <span>{song.title}</span>
                                                    <span className="text-muted-foreground text-sm">
                                                        {song.source}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <PlayButton
                                                        songID={song.id}
                                                    />
                                                    <Button
                                                        onClick={() =>
                                                            onRemoveFromQueue(
                                                                song.id
                                                            )
                                                        }
                                                        size={"icon"}
                                                    >
                                                        <Cross1Icon />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    {/* </ScrollArea> */}
                </DragDropContext>
            </div>
        </div>
    );
}

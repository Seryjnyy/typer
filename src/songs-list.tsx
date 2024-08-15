import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    DotsHorizontalIcon,
    Pencil1Icon,
    PlusIcon,
    TrashIcon,
} from "@radix-ui/react-icons";
import PlayButton from "./components/play-button";
import { Button } from "./components/ui/button";
import CreateSongForm from "./create-song-form";
import { useQueueStore } from "./lib/store/queue-store";
import { useSongStore } from "./lib/store/song-store";
import { cn } from "./lib/utils";
import {
    SongBanner,
    SongDetail,
    SongHeader,
} from "./components/ui/song-header";

const AllSongs = () => {
    const songStore = useSongStore();
    const queue = useQueueStore();

    const onAddToQueue = (songId: string) => {
        queue.enqueue(songId);
    };

    return (
        <div className="pl-8 pb-5 relative">
            {/* <Button>Add all to queue</Button> */}
            <div className="space-y-2  pr-2">
                {songStore.songs.map((song, index) => (
                    <div
                        className="border p-4  group hover:bg-secondary rounded-md flex justify-between items-center"
                        key={song.id}
                    >
                        <div className="flex gap-4 items-center">
                            <div className="text-muted group-hover:text-foreground">
                                {index + 1}
                            </div>
                            <SongHeader>
                                <SongBanner song={song} />
                                <SongDetail
                                    className="pl-3"
                                    song={song}
                                    isCurrent={song.id == queue.current}
                                />
                            </SongHeader>
                        </div>

                        <div className="flex justify-between items-center gap-4">
                            <div className="flex gap-4 border border-dashed p-2 rounded-lg">
                                <span className="text-xs text-muted-foreground">
                                    98%
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    87 wpm
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {song.completion} completions
                                </span>
                            </div>

                            <Button
                                className="space-x-1"
                                size={"sm"}
                                onClick={() => onAddToQueue(song.id)}
                                variant={"outline"}
                            >
                                <PlusIcon />
                                <span> Queue</span>
                            </Button>
                            <Button
                                onClick={() => songStore.removeSong(song.id)}
                                className="space-x-1 text-destructive"
                            >
                                <TrashIcon />
                                <span>Delete</span>
                            </Button>
                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <DotsHorizontalIcon />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem
                                            className="space-x-1"
                                            onClick={() =>
                                                onAddToQueue(song.id)
                                            }
                                        >
                                            <PlusIcon />
                                            <span> Queue</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="space-x-1">
                                            <PlusIcon />
                                            <span> Playlist</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="space-x-1">
                                            <PlusIcon />
                                            <span> Next</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="space-x-1">
                                            <Pencil1Icon />
                                            <span>Edit</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                songStore.removeSong(song.id)
                                            }
                                            className="space-x-1 text-destructive"
                                        >
                                            <TrashIcon />
                                            <span>Delete</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* </ScrollArea> */}
        </div>
    );
};

const AddSong = () => {
    return (
        <div className="px-8">
            <CreateSongForm />
        </div>
    );
};

export default function SongsList() {
    const songStore = useSongStore();
    return (
        <Tabs defaultValue="all-songs" className="py-8 h-full ">
            <TabsList className="mx-8">
                <TabsTrigger value="all-songs">All songs</TabsTrigger>
                {/* <TabsTrigger value="playlists">Playlists</TabsTrigger> */}
                <TabsTrigger value="add-song">Add song</TabsTrigger>
            </TabsList>
            <TabsContent
                value="all-songs"
                className="relative overflow-y-scroll h-full"
            >
                <div className="absolute top-0 left-0 h-full w-full">
                    <AllSongs />
                </div>
            </TabsContent>
            {/* <TabsContent value="playlists">playlists</TabsContent> */}
            <TabsContent value="add-song">
                <AddSong />
            </TabsContent>
        </Tabs>
    );
}

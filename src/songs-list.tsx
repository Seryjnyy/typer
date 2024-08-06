import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    DotsHorizontalIcon,
    DotsVerticalIcon,
    Pencil1Icon,
    PlayIcon,
    PlusIcon,
    TrashIcon,
} from "@radix-ui/react-icons";
import { Button } from "./components/ui/button";
import CreateSongForm from "./create-song-form";
import { useQueueStore } from "./lib/store/queue-store";
import { useSongStore } from "./lib/store/song-store";
import MusicPlaying from "./components/music-playing";
import PlayButton from "./components/play-button";

const AllSongs = () => {
    const songStore = useSongStore();
    const queue = useQueueStore();

    const onAddToQueue = (songId: string) => {
        queue.enqueue(songId);
    };

    const onAddNext = (songId: string) => {};

    return (
        <div className="pl-8 pb-5 relative">
            {/* <h2 className="p-2 border w-fit">{songStore.songs.length} songs</h2> */}
            {/* <ScrollArea className="w-full bg-blue-200 h-[80vh]"> */}
            {/* <Button
        onClick={() =>
          songStore.addSong({
            id: "test" + Date.now().toString(),
            content: "test" + Date.now().toString(),
            source: "test" + Date.now().toString(),
            title: "test" + Date.now().toString(),
          })
        }
      >
        Add
      </Button> */}
            {/* <Button>Add all to queue</Button> */}
            <div className="space-y-2  pr-2">
                {songStore.songs.map((song) => (
                    <div
                        className="border p-4  group hover:bg-secondary rounded-md flex justify-between items-center"
                        key={song.id}
                    >
                        <div className="flex gap-2 items-center">
                            <div className="flex gap-2">
                                <PlayButton songID={song.id} />
                            </div>
                            <div className="flex flex-col justify-center leading-tight">
                                <span className="text-ellipsis overflow-hidden ">
                                    {song.title}
                                </span>
                                <span className="text-muted-foreground text-sm text-ellipsis overflow-hidden">
                                    {song.source}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center gap-12">
                            <div className="flex gap-4">
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

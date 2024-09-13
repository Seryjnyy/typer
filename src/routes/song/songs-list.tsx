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
    EyeOpenIcon,
    Pencil1Icon,
    PlusIcon,
    TrashIcon,
} from "@radix-ui/react-icons";
import { Button } from "../../components/ui/button";
import {
    SongBanner,
    SongDetail,
    SongHeader,
} from "../../components/ui/song-header";

import { useQueueStore } from "../../lib/store/queue-store";
import { useSongStore } from "../../lib/store/song-store";
import { ScrollArea } from "../../components/ui/scroll-area";
import { useNavigate, useParams } from "react-router-dom";
import CreateSongForm from "./create-song-form";

const AllSongs = () => {
    const songs = useSongStore.use.songs();
    const removeSong = useSongStore.use.removeSong();

    const currentSong = useQueueStore.use.current();
    const enqueue = useQueueStore.use.enqueue();
    const queueNext = useQueueStore.use.queueNext();

    const navigate = useNavigate();

    const onAddToQueue = (songId: string) => {
        enqueue(songId);
    };

    return (
        <div className="relative h-full ">
            {/* <Button>Add all to queue</Button> */}
            <ScrollArea className="h-[calc(100%)] pr-3 ">
                {/* <div className="space-y-2  pr-2"> */}
                <div className="flex flex-col gap-2">
                    {songs.map((song, index) => (
                        <div
                            className="border p-4  group hover:bg-secondary rounded-md flex justify-between items-center "
                            key={song.id}
                            onClick={() => navigate(`/songs/${song.id}`)}
                        >
                            <div className="flex gap-4 items-center">
                                <div className="text-muted group-hover:text-foreground">
                                    {index + 1}
                                </div>
                                <SongHeader>
                                    <SongBanner song={song} />
                                    <SongDetail
                                        length={"extra-long"}
                                        className="pl-3"
                                        song={song}
                                        isCurrent={song.id == currentSong}
                                    />
                                </SongHeader>
                            </div>

                            <div className="flex justify-between items-center gap-4">
                                <div className="flex gap-4 border border-dashed  p-2 rounded-lg">
                                    <span className="text-xs text-muted-foreground">
                                        {song.record.accuracy}%
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {song.record.chpm} chpm
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {song.completion} completions
                                    </span>
                                </div>

                                <Button
                                    className="space-x-1"
                                    size={"sm"}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAddToQueue(song.id);
                                    }}
                                    variant={"outline"}
                                >
                                    <PlusIcon />
                                    <span> Queue</span>
                                </Button>
                                <Button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeSong(song.id);
                                    }}
                                    className="space-x-1 "
                                    variant={"destructive"}
                                >
                                    <TrashIcon />
                                </Button>
                                <div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="p-2">
                                            <DotsHorizontalIcon />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem
                                                className="space-x-1"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onAddToQueue(song.id);
                                                }}
                                            >
                                                <PlusIcon />
                                                <span> Queue</span>
                                            </DropdownMenuItem>
                                            {/* <DropdownMenuItem className="space-x-1">
                                                <PlusIcon />
                                                <span> Playlist</span>
                                            </DropdownMenuItem> */}
                                            <DropdownMenuItem
                                                className="space-x-1"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    queueNext(song.id);
                                                }}
                                            >
                                                <PlusIcon />
                                                <span> Next</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="space-x-1"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`./${song.id}`);
                                                }}
                                            >
                                                <EyeOpenIcon />
                                                <span>View more</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="space-x-1"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(
                                                        `./${song.id}/edit`
                                                    );
                                                }}
                                            >
                                                <Pencil1Icon />
                                                <span>Edit</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeSong(song.id);
                                                }}
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
                {/* </div> */}
            </ScrollArea>
        </div>
    );
};

export default function SongsList() {
    return (
        <Tabs defaultValue="all-songs" className="py-12 h-full ">
            <TabsList className="mx-12">
                <TabsTrigger value="all-songs">All songs</TabsTrigger>
                {/* <TabsTrigger value="playlists">Playlists</TabsTrigger> */}
                <TabsTrigger
                    value="add-song"
                    className="flex items-center gap-1"
                >
                    <PlusIcon />
                    Add song
                </TabsTrigger>
            </TabsList>
            <TabsContent value="all-songs" className=" h-[100%] px-12">
                <div className="h-full w-full">
                    <AllSongs />
                </div>
            </TabsContent>
            {/* <TabsContent value="playlists">playlists</TabsContent> */}
            <TabsContent value="add-song" className=" h-[100%] ">
                <CreateSongForm />
            </TabsContent>
        </Tabs>
    );
}

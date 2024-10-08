import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    DotsHorizontalIcon,
    DownloadIcon,
    EyeOpenIcon,
    Pencil1Icon,
    PlayIcon,
    PlusIcon,
    TrashIcon,
} from "@radix-ui/react-icons";

import { useNavigate } from "react-router-dom";
import { useQueueStore } from "../../lib/store/queue-store";
import { useSongStore } from "../../lib/store/song-store";
import { Song } from "@/lib/types";
import usePlaySong from "@/lib/hooks/use-play-song";
import useExportSongs from "@/lib/hooks/use-export-song";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ReactNode, useState } from "react";
import { Input } from "@/components/ui/input";
import CreatePlaylistForm from "./create-playlist-form";
import { usePlaylistStore } from "@/lib/store/playlist-store";
import { cn } from "@/lib/utils";
import usePlaylist from "@/lib/hooks/use-playlist";

const PlaylistSongMosaic = ({ songs }: { songs: string[] }) => {
    const songsList = useSongStore.use.songs();

    if (songs.length == 0) {
        return <div className="w-6 h-6 bg-popover/50 rounded-[2px]"></div>;
    }

    if (songs.length == 1) {
        const s = songsList.find((x) => x.id == songs[0]);
        return (
            <div
                className={cn(
                    "w-6 h-6  rounded-[2px]",
                    s?.cover ? s.cover : "bg-gray-600"
                )}
            ></div>
        );
    }

    if (songs.length == 2) {
        const s = songsList.find((x) => x.id == songs[0]);
        const s2 = songsList.find((x) => x.id == songs[1]);
        return (
            <div className={cn("w-6 h-6   rounded-[2px] bg-gray-600 flex")}>
                <div
                    className={cn(
                        "w-[0.68rem]  h-6 rounded-l-[2px] ",
                        s?.cover ?? ""
                    )}
                ></div>
                <div
                    className={cn(
                        "w-[0.68rem]  h-6 rounded-r-[2px] ",
                        s2?.cover ?? ""
                    )}
                ></div>
            </div>
        );
    }

    if (songs.length == 3) {
        const s = songsList.find((x) => x.id == songs[0]);
        const s2 = songsList.find((x) => x.id == songs[1]);
        const s3 = songsList.find((x) => x.id == songs[2]);
        return (
            <div
                className={cn(
                    "w-6 h-6   rounded-[2px] bg-gray-600 flex flex-col"
                )}
            >
                <div className="flex">
                    <div
                        className={cn(
                            "w-[0.68rem]  h-3 rounded-l-[2px] ",
                            s?.cover ?? ""
                        )}
                    ></div>
                    <div
                        className={cn(
                            "w-[0.68rem]  h-3 rounded-r-[2px] ",
                            s2?.cover ?? ""
                        )}
                    ></div>
                </div>
                <div
                    className={cn(
                        "w-[1.35rem]  h-3 rounded-b-[2px] ",
                        s3?.cover ?? ""
                    )}
                ></div>
            </div>
        );
    }

    if (songs.length >= 4) {
        const s = songsList.find((x) => x.id == songs[0]);
        const s2 = songsList.find((x) => x.id == songs[1]);
        const s3 = songsList.find((x) => x.id == songs[2]);
        const s4 = songsList.find((x) => x.id == songs[3]);
        return (
            <div
                className={cn(
                    "w-6 h-6   rounded-[2px] bg-gray-600 flex flex-col"
                )}
            >
                <div className="flex">
                    <div
                        className={cn(
                            "w-[0.68rem]  h-3 rounded-tl-[2px] ",
                            s?.cover ?? ""
                        )}
                    ></div>
                    <div
                        className={cn(
                            "w-[0.68rem]  h-3 rounded-tr-[2px] ",
                            s2?.cover ?? ""
                        )}
                    ></div>
                </div>
                <div className="flex">
                    <div
                        className={cn(
                            "w-[0.68rem]  h-3 rounded-bl-[2px] ",
                            s3?.cover ?? ""
                        )}
                    ></div>
                    <div
                        className={cn(
                            "w-[0.68rem]  h-3 rounded-br-[2px] ",
                            s4?.cover ?? ""
                        )}
                    ></div>
                </div>
            </div>
        );
    }

    // return ()
};

const AddToPlaylistDialog = ({ song }: { song: Song }) => {
    const [newPlaylistOpen, setNewPlaylistOpen] = useState(false);
    const playlists = usePlaylistStore.use.playlists();
    const { addToPlaylist, getPlaylistSongs } = usePlaylist();
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                onClick={(e) => {
                    e.stopPropagation();
                }}
                className="flex gap-1 items-center"
            >
                <PlusIcon />
                <span>Add to playlist</span>
            </DialogTrigger>
            <DialogContent
                onClick={(e) => e.stopPropagation()}
                className="w-[20rem] h-[30rem] flex flex-col justify-start"
            >
                <DialogHeader className="border-b pb-1">
                    <DialogTitle className="text-muted-foreground">
                        Add song to...
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        Chose a playlist to add the song to, or create a new
                        playlist.
                    </DialogDescription>
                </DialogHeader>
                {newPlaylistOpen && (
                    <div className="w-full  flex-col h-full pt-10 ">
                        <span className="border-b font-bold text-xl">
                            New playlist
                        </span>
                        <CreatePlaylistForm
                            songs={[song.id]}
                            onCancel={() => setNewPlaylistOpen(false)}
                            onSave={() => {
                                setNewPlaylistOpen(false);
                                setOpen(false);
                            }}
                        />
                    </div>
                )}
                {!newPlaylistOpen && (
                    <ScrollArea className="h-[26.3rem]     pr-3 pl-1 py-1 ">
                        <div className="flex flex-col gap-3">
                            <div className="pb-1 border-b">
                                <Button
                                    className="w-full rounded-none"
                                    variant={"ghost"}
                                    onClick={() => setNewPlaylistOpen(true)}
                                >
                                    <PlusIcon /> New playlist
                                </Button>
                            </div>
                            {playlists.map((playlist) => {
                                const playlistSongs = getPlaylistSongs(
                                    playlist.id
                                );
                                return (
                                    <Button
                                        className="w-full rounded-none"
                                        variant={"ghost"}
                                        key={playlist.id}
                                        onClick={() => {
                                            addToPlaylist(playlist.id, song.id);
                                            setOpen(false);
                                        }}
                                    >
                                        <PlaylistSongMosaic
                                            songs={playlistSongs}
                                        />
                                        <span className="w-full ">
                                            {playlist.title} -{" "}
                                            {playlistSongs.length}
                                        </span>
                                    </Button>
                                );
                            })}
                        </div>
                    </ScrollArea>
                )}
            </DialogContent>
        </Dialog>
    );
};

interface SongPopoverProps {
    song: Song;
    exclude?: { viewMore?: boolean };
    destructiveMenuItems?: ReactNode;
}

export default function SongPopover({
    song,
    exclude,
    destructiveMenuItems,
}: SongPopoverProps) {
    const queueNext = useQueueStore.use.queueNext();
    const removeSong = useSongStore.use.removeSong();
    const enqueue = useQueueStore.use.enqueue();
    const playSong = usePlaySong();
    const { exportSongs } = useExportSongs();

    const onAddToQueue = (songId: string) => {
        enqueue(songId);
    };
    const navigate = useNavigate();

    const handleExportSong = () => {
        exportSongs([song]);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="p-2  rounded-sm">
                <DotsHorizontalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem
                    className="space-x-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        playSong(song.id);
                    }}
                >
                    <PlayIcon />
                    <span> Play</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
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
                {!exclude?.viewMore && (
                    <>
                        <DropdownMenuItem
                            className="space-x-1"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/songs/${song.id}`);
                            }}
                        >
                            <EyeOpenIcon />
                            <span>View more</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                    </>
                )}
                <DropdownMenuItem
                    className="space-x-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/songs/${song.id}/edit`);
                    }}
                >
                    <Pencil1Icon />
                    <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                    <AddToPlaylistDialog song={song} />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="space-x-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleExportSong();
                    }}
                >
                    <DownloadIcon />
                    <span>Export</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {destructiveMenuItems}

                <DropdownMenuItem className="space-x-1 text-destructive">
                    {/* TODO: Is this delete stuff duplicate with delete button on songItem? */}
                    <AlertDialog>
                        <AlertDialogTrigger
                            asChild
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            <div className="gap-1 relative flex  cursor-default select-none items-center rounded-sm   text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground ">
                                <TrashIcon />
                                Delete
                            </div>
                        </AlertDialogTrigger>
                        <AlertDialogContent
                            onClick={(e) => e.stopPropagation()}
                        >
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete the song.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeSong(song.id);
                                        navigate("/songs");
                                    }}
                                >
                                    Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

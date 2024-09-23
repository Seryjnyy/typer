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

interface SongPopoverProps {
    song: Song;
    exclude?: { viewMore?: boolean };
}

export default function SongPopover({ song, exclude }: SongPopoverProps) {
    const queueNext = useQueueStore.use.queueNext();
    const removeSong = useSongStore.use.removeSong();
    const enqueue = useQueueStore.use.enqueue();
    const playSong = usePlaySong();

    const onAddToQueue = (songId: string) => {
        enqueue(songId);
    };
    const navigate = useNavigate();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="p-2  rounded-sm">
                <DotsHorizontalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
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
                <DropdownMenuItem className="space-x-1 text-destructive">
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

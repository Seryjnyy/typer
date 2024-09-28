import { Playlist } from "@/lib/store/playlist-store";
import {
    DotsHorizontalIcon,
    DownloadIcon,
    EyeOpenIcon,
    Pencil1Icon,
    PlayIcon,
    PlusIcon,
} from "@radix-ui/react-icons";

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

import { TrashIcon } from "@radix-ui/react-icons";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router";
import usePlaylist from "@/lib/hooks/use-playlist";

interface PlaylistPopoverProps {
    playlist: Playlist;
    exclude?: { viewMore?: boolean };
}

const PlaylistPopover = ({ playlist, exclude }: PlaylistPopoverProps) => {
    const navigate = useNavigate();
    const { deletePlaylist, playPlaylist } = usePlaylist();

    const handleDeletePlaylist = () => {
        deletePlaylist(playlist.id);
        navigate("/songs?tab=playlists");
    };

    const handleEnqueue = () => {
        playPlaylist(playlist.id, true);
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

                        playPlaylist(playlist.id);
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

                        handleEnqueue();
                    }}
                >
                    <PlusIcon />
                    <span> Enqueue</span>
                </DropdownMenuItem>

                {/* <DropdownMenuItem
                className="space-x-1"
                onClick={(e) => {
                    e.stopPropagation();
                    onAddToQueue(song.id);
                }}
            >
                <PlusIcon />
                <span> Queue</span>
            </DropdownMenuItem> */}

                <DropdownMenuSeparator />
                {!exclude?.viewMore && (
                    <>
                        <DropdownMenuItem
                            className="space-x-1"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/songs/playlist/${playlist.id}`);
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
                        // navigate(`/songs/${song.id}/edit`);
                    }}
                    disabled
                >
                    <Pencil1Icon />
                    <span>Edit</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    className="space-x-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        // handleExportSong();
                    }}
                    disabled
                >
                    <DownloadIcon />
                    <span>Export</span>
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
                                    permanently delete the playlist.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeletePlaylist();
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
};

export default PlaylistPopover;

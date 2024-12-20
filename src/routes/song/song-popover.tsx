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
} from "@/components/ui/alert-dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { DotsHorizontalIcon, DownloadIcon, EyeOpenIcon, Pencil1Icon, PlayIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import useExportSongs from "@/lib/hooks/use-export-song"
import usePlaySong from "@/lib/hooks/use-play-song"
import usePlaylists from "@/lib/hooks/use-playlists"
import { usePlaylistStore } from "@/lib/store/playlist-store"
import { Song } from "@/lib/types"
import { ReactNode, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQueueStore } from "../../lib/store/queue-store"
import { useSongStore } from "../../lib/store/song-store"
import CreatePlaylistForm from "./create-playlist-form"
import { PlaylistBanner } from "./playlist-header"
import { Icons } from "@/components/icons.tsx"
import SpotifyFeatureGuard from "@/components/spotify/spotify-feature-guard.tsx"
import { DialogProps } from "@radix-ui/react-dialog"

interface AddToPlaylistDialogProps extends DialogProps {
    song: Song
}

const AddToPlaylistDialog = ({ song, open, onOpenChange }: AddToPlaylistDialogProps) => {
    const [newPlaylistOpen, setNewPlaylistOpen] = useState(false)
    const playlists = usePlaylistStore.use.playlists()
    const { addToPlaylist, getPlaylistSongs } = usePlaylists()
    const [_open, _setOpen] = useState(false)

    const actualOpen = open ? open : _open

    const handleOpenChange = (val: boolean) => {
        _setOpen(val)
        onOpenChange && onOpenChange(val)
    }

    return (
        <Dialog open={actualOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger
                onClick={(e) => {
                    e.stopPropagation()
                }}
                className="flex gap-1 items-center"
                asChild
            >
                <>
                    <PlusIcon />
                    <span>Add to playlist</span>
                </>
            </DialogTrigger>
            <DialogContent
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                className="w-[20rem] h-[30rem] flex flex-col justify-start"
            >
                <DialogHeader className="border-b pb-1">
                    <DialogTitle className="text-muted-foreground">Add song to...</DialogTitle>
                    <DialogDescription className="sr-only">
                        Chose a playlist to add the song to, or create a new playlist.
                    </DialogDescription>
                </DialogHeader>
                {newPlaylistOpen && (
                    <div className="w-full  flex-col h-full pt-10 ">
                        <span className="border-b font-bold text-xl">New playlist</span>
                        <CreatePlaylistForm
                            songs={[song.id]}
                            onCancel={() => setNewPlaylistOpen(false)}
                            onSave={() => {
                                setNewPlaylistOpen(false)
                                handleOpenChange(false)
                            }}
                        />
                    </div>
                )}
                {!newPlaylistOpen && (
                    <ScrollArea className="h-[26.3rem]     pr-3 pl-1 py-1 ">
                        <div className="flex flex-col gap-3">
                            <div className="pb-1 border-b">
                                <Button className="w-full rounded-none" variant={"ghost"} onClick={() => setNewPlaylistOpen(true)}>
                                    <PlusIcon /> New playlist
                                </Button>
                            </div>
                            {playlists.map((playlist) => {
                                const playlistSongs = getPlaylistSongs(playlist.id)
                                return (
                                    <Button
                                        className="w-full rounded-none"
                                        variant={"ghost"}
                                        key={playlist.id}
                                        onClick={() => {
                                            addToPlaylist(playlist.id, song.id)
                                            handleOpenChange(false)
                                        }}
                                    >
                                        <div>
                                            <PlaylistBanner size={"sm"} playlist={playlist} />
                                        </div>
                                        <span className="w-full ">
                                            {playlist.title} - {playlistSongs.length}
                                        </span>
                                    </Button>
                                )
                            })}
                        </div>
                    </ScrollArea>
                )}
            </DialogContent>
        </Dialog>
    )
}

interface SongPopoverProps {
    song: Song
    exclude?: { viewMore?: boolean }
    destructiveMenuItems?: ReactNode
}

// TODO : this is a dropdown not popover
export default function SongPopover({ song, exclude, destructiveMenuItems }: SongPopoverProps) {
    const queueNext = useQueueStore.use.queueNext()
    const removeSong = useSongStore.use.removeSong()
    const enqueue = useQueueStore.use.enqueue()
    const playSong = usePlaySong()
    const { exportSongs } = useExportSongs()
    const [open, setOpen] = useState(false)
    const [openDeleteAlert, setOpenDeleteAlert] = useState(false)
    const [openAddToPlaylistDialog, setOpenAddToPlaylistDialog] = useState(false)

    const onAddToQueue = (songId: string) => {
        enqueue(songId)
    }
    const navigate = useNavigate()

    const handleExportSong = () => {
        exportSongs([song])
    }

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant={"ghost"}>
                    <DotsHorizontalIcon />
                </Button>
            </DropdownMenuTrigger>
            {open && (
                <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem
                        onClick={(e) => {
                            e.stopPropagation()
                            playSong(song.id)
                        }}
                    >
                        <PlayIcon />
                        <span> Play</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={(e) => {
                            e.stopPropagation()
                            onAddToQueue(song.id)
                        }}
                    >
                        <PlusIcon />
                        <span> Queue</span>
                    </DropdownMenuItem>
                    {song.spotifyUri && (
                        <SpotifyFeatureGuard>
                            <DropdownMenuItem
                                onClick={(e) => {
                                    playSong(song.id, false)
                                    e.stopPropagation()
                                }}
                            >
                                <div className={"flex gap-2 items-center"}>
                                    <Icons.spotify className="size-4 fill-spotifyGreen" /> Play
                                </div>
                            </DropdownMenuItem>
                        </SpotifyFeatureGuard>
                    )}

                    <DropdownMenuItem
                        onClick={(e) => {
                            e.stopPropagation()
                            queueNext(song.id)
                        }}
                    >
                        <PlusIcon />
                        <span> Next</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {!exclude?.viewMore && (
                        <>
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation()
                                    navigate(`/songs/${song.id}`)
                                }}
                            >
                                <EyeOpenIcon />
                                <span>View more</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </>
                    )}
                    <DropdownMenuItem
                        onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/songs/${song.id}/edit`)
                        }}
                    >
                        <Pencil1Icon />
                        <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                            setOpenAddToPlaylistDialog((prev) => !prev)
                            console.log("on click")
                        }}
                        onKeyDown={(e) => {
                            // Need this to open the dialog without closing the popover
                            if (e.key === "Enter") {
                                e.preventDefault()
                                setOpenAddToPlaylistDialog((prev) => !prev)
                            }
                        }}
                    >
                        <AddToPlaylistDialog song={song} open={openAddToPlaylistDialog} onOpenChange={setOpenAddToPlaylistDialog} />
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={(e) => {
                            e.stopPropagation()
                            handleExportSong()
                        }}
                    >
                        <DownloadIcon />
                        <span>Export</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {destructiveMenuItems}

                    <DropdownMenuItem
                        className=" text-destructive"
                        onKeyDown={(e) => {
                            // Need this to open the alert dialog without closing the popover
                            if (e.key === "Enter") {
                                e.preventDefault()
                                setOpenDeleteAlert((prev) => !prev)
                            }
                        }}
                    >
                        {/* TODO: Is this delete stuff duplicate with delete button on songItem? */}
                        <AlertDialog open={openDeleteAlert} onOpenChange={setOpenDeleteAlert}>
                            <AlertDialogTrigger
                                asChild
                                onClick={(e) => {
                                    e.stopPropagation()
                                }}
                            >
                                <div className="gap-1 relative flex  cursor-default select-none items-center rounded-sm   text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground ">
                                    <TrashIcon />
                                    Delete
                                </div>
                            </AlertDialogTrigger>
                            <AlertDialogContent
                                onClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => {
                                    e.stopPropagation()
                                }}
                            >
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the song.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            removeSong(song.id)
                                            navigate("/songs")
                                        }}
                                    >
                                        Continue
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            )}
        </DropdownMenu>
    )
}

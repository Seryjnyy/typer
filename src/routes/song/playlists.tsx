import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Playlist, usePlaylistStore } from "@/lib/store/playlist-store";
import { PlusIcon } from "@radix-ui/react-icons";
import { useMemo, useState } from "react";

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

import { useNavigate } from "react-router";
import {
    PlaylistBanner,
    PlaylistDetail,
    PlaylistHeader,
} from "./playlist-header";
import PlaylistPopover from "./playlist-popover";
import usePlaylist from "@/lib/hooks/use-playlist";

const PlaylistItem = ({
    playlist,
    index,
}: {
    playlist: Playlist;
    index: number;
}) => {
    const navigate = useNavigate();
    const { deletePlaylist, playPlaylist, getPlaylistSongs } = usePlaylist();

    const handleDeletePlaylist = () => {
        deletePlaylist(playlist.id);
    };

    const handleEnqueue = () => {
        playPlaylist(playlist.id, true);
    };

    const playlistSongs = useMemo(() => {
        return getPlaylistSongs(playlist.id);
    }, [playlist]);

    return (
        <div
            className="border p-4  group hover:bg-secondary rounded-md flex justify-between items-center "
            key={playlist.id}
            onClick={() => navigate(`/songs/playlist/${playlist.id}`)}
        >
            <div className="flex gap-4 items-center ">
                <div
                    className="text-muted group-hover:text-foreground "
                    onClick={(e) => e.stopPropagation()}
                >
                    {index + 1}
                </div>
                <PlaylistHeader>
                    <PlaylistBanner
                        playlist={playlist}
                        playButton
                        onClick={(e) => e.stopPropagation()}
                    />
                    <PlaylistDetail
                        playlist={playlist}
                        onClick={(e) => e.stopPropagation()}
                        className="pl-3"
                    />
                </PlaylistHeader>
            </div>

            <div className="flex justify-between items-center gap-4">
                <div className=" gap-4 items-center text-xs text-muted-foreground hidden sm:flex">
                    <span>{playlistSongs.length} songs</span>
                    <span>
                        {new Date(playlist.createdAt).toLocaleDateString()}
                    </span>
                </div>
                <div className="gap-1 hidden md:flex">
                    <Button
                        variant={"outline"}
                        size={"sm"}
                        className="space-x-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEnqueue();
                        }}
                    >
                        <PlusIcon /> <span>Enqueue</span>
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger
                            asChild
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            <Button variant={"destructive"} size={"sm"}>
                                <TrashIcon />
                            </Button>
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
                </div>
                <PlaylistPopover playlist={playlist} />
            </div>
        </div>
    );
};

export default function Playlists() {
    const [searchTerm, setSearchTerm] = useState("");
    const playlistList = usePlaylistStore.use.playlists();

    const lowerCaseSearchTerm = searchTerm.toLocaleLowerCase();
    const filteredAndSorted = useMemo(() => {
        return playlistList;
        // return sortSongs(
        //     songsList,
        //     songListPreferences.order,
        //     songListPreferences.sortBy
        // );
    }, [
        playlistList,
        lowerCaseSearchTerm,
        //  songListPreferences
    ]);

    return (
        <div className=" h-full border-t">
            <ScrollArea className="h-[calc(100%)] pr-3 mt-1 pb-1  ">
                <div className="flex flex-col gap-2 ">
                    {filteredAndSorted.length > 0 &&
                        filteredAndSorted.map((playlist, index) => (
                            // <SongItem
                            //     key={song.id}
                            //     song={song}
                            //     index={index}
                            //     listStyle={songListPreferences.listStyle}
                            // />
                            <PlaylistItem
                                playlist={playlist}
                                index={index}
                                key={playlist.id}
                            />
                        ))}
                    {/* {songsList.length > 0 && filteredSongs.length == 0 && (
                            <div className="w-full flex items-center justify-center mt-12">
                                <div className="flex flex-col text-center">
                                    <h3 className="font-semibold text-2xl">
                                        No results found
                                    </h3>
                                    <span className="text-muted-foreground ">
                                        Couldn't find what you searched for.
                                    </span>
                                </div>
                            </div>
                        )} */}
                    {filteredAndSorted.length == 0 && (
                        <div className="w-full flex items-center justify-center mt-12">
                            <div className="flex flex-col text-center">
                                <h3 className="font-semibold text-2xl">
                                    You don't have any playlists.
                                </h3>
                                <span className="text-muted-foreground ">
                                    Create one.
                                </span>
                                <Button variant={"secondary"} className="mt-8">
                                    <PlusIcon />
                                    New playlist
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}

import BackButton from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import {
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import usePlaylist from "@/lib/hooks/use-playlist";
import { usePlaylistStore } from "@/lib/store/playlist-store";
import { useSongStore } from "@/lib/store/song-store";
import { Song } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils";
import { Cross1Icon, Pencil1Icon } from "@radix-ui/react-icons";
import { useMemo } from "react";
import { useParams } from "react-router";
import { PlaylistBanner, PlaylistHeader } from "../playlist-header";
import PlaylistPopover from "../playlist-popover";
import SongsList from "../songs-list";
import { Link } from "react-router-dom";

const SomethingWentWrong = () => {
    return (
        <div className="flex justify-center items-center h-full flex-col gap-12">
            <div className="text-center">
                <h1 className="text-xl font-semibold">
                    Sorry something went wrong.
                </h1>
                <p>The song might not exist anymore.</p>
            </div>
            <BackButton link="/songs" />
        </div>
    );
};

// TODO : on smaller screens text will be too long fix that
export default function PlaylistPage() {
    const playlists = usePlaylistStore.use.playlists();
    const { playlistID } = useParams();
    const getSongData = useSongStore.use.getSongData();

    const { removeFromPlaylist, getPlaylistSongs } = usePlaylist();

    if (!playlistID) {
        throw Error("No playlist ID provided.");
    }

    const playlist = playlists.find((x) => x.id == playlistID);

    if (!playlist) return <SomethingWentWrong />;

    const playlistSongs = useMemo(() => {
        return getPlaylistSongs(playlist.id);
    }, [playlist]);

    const randomBgGradient = useMemo(() => {
        const randomSong =
            playlistSongs.length > 0
                ? playlistSongs[
                      Math.floor(Math.random() * playlistSongs.length)
                  ]
                : null;

        return randomSong ? getSongData(randomSong)?.cover.split(" ")[1] : "";
    }, [playlists]);

    const handleRemoveSongFromPlaylist = (song: Song) => {
        removeFromPlaylist(playlist.id, song.id);
    };

    return (
        <div className={` h-[100%] sm:rounded-md overflow-hidden`}>
            <ScrollArea className={`h-[100%]  pb-2  flex flex-col relative `}>
                <div
                    className={`flex flex-col items-start justify-start space-y-12 pt-12 w-full  px-2 sm:px-12  bg-gradient-to-b  ${randomBgGradient}
                from-[5%] to-[60%]`}
                >
                    <BackButton link="/songs?tab=playlists" />
                    <div className="space-y-4 w-full">
                        <div>
                            <PlaylistHeader>
                                <PlaylistBanner
                                    playButtonHover
                                    playlist={playlist}
                                    size={"extraLarge"}
                                />
                                <div className="flex flex-col justify-center items-start px-8">
                                    <span className="text-foreground/80 select-none">
                                        Playlist
                                    </span>
                                    <h1 className="text-2xl font-bold">
                                        {playlist.title}
                                    </h1>
                                </div>
                            </PlaylistHeader>
                        </div>

                        <div className="flex items-end justify-between   w-full ">
                            <div className="flex gap-4 border border-dashed p-2 rounded-lg w-fit ">
                                <span className="text-xs text-muted-foreground">
                                    {playlistSongs.length} songs
                                </span>
                            </div>

                            <div className="flex gap-2   items-center  justify-between">
                                <div className="w-fit">
                                    <Link
                                        to={`/songs/playlist/${playlist.id}/edit`}
                                    >
                                        <Button size={"icon"} variant={"ghost"}>
                                            <Pencil1Icon />
                                        </Button>
                                    </Link>
                                </div>

                                <PlaylistPopover
                                    playlist={playlist}
                                    exclude={{ viewMore: true }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-12 px-[1.75rem] sm:px-[4.25rem]">
                    <h2 className="text-3xl font-bold text-muted-foreground pb-8 select-none">
                        Songs
                    </h2>
                    {playlistSongs.length > 0 && (
                        <SongsList
                            exclude={{ deleteButton: true }}
                            songsList={playlistSongs
                                .map((songID) => getSongData(songID))
                                .filter((x) => x != undefined)}
                            listItemButtonRender={(song) => (
                                <Button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        console.log(playlist.id, song.title);
                                    }}
                                    variant={"destructive"}
                                    size={"icon"}
                                >
                                    <Cross1Icon />
                                </Button>
                            )}
                            listItemPopoverDestructiveRender={(song) => (
                                <>
                                    <DropdownMenuItem
                                        className="space-x-1 text-destructive"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveSongFromPlaylist(song);
                                        }}
                                    >
                                        <Cross1Icon className="size-3 " />
                                        <span>Remove from playlist</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                </>
                            )}
                        />
                    )}
                </div>

                <div className="w-full  flex items-center pt-24 flex-wrap gap-2 sm:gap-12 px-[1.75rem] sm:px-[4.25rem]">
                    <div className="flex  text-muted-foreground gap-1">
                        <span className="text-xs opacity-70">created at: </span>
                        <span className="text-xs">
                            {formatTimestamp(playlist.createdAt)}
                        </span>
                    </div>
                    <div className="flex  text-muted-foreground gap-1">
                        <span className="text-xs opacity-70">
                            last modified at:
                        </span>
                        <span className="text-xs">
                            {formatTimestamp(playlist.lastModifiedAt)}
                        </span>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}

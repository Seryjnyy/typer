import SongCarousel from "@/components/song-carousel";
import { Button } from "@/components/ui/button";
import usePlaySong from "@/lib/hooks/use-play-song";
import usePlaylist from "@/lib/hooks/use-playlist";
import { usePlaylistStore } from "@/lib/store/playlist-store";
import { useQueueStore } from "@/lib/store/queue-store";
import { useSongStore } from "@/lib/store/song-store";
import { useUiStateStore } from "@/lib/store/ui-state-store";
import { Song } from "@/lib/types";
import { cn, shuffleArray, splitSongIntoVerses } from "@/lib/utils";
import { PlayIcon, PlusIcon } from "@radix-ui/react-icons";
import { shuffle } from "lodash";
import { useMemo } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

export default function NoSongSelected() {
    const songs = useSongStore.use.songs();
    const isQueueWindowOpen = useUiStateStore.use.queueWindowOpen();
    const playSong = usePlaySong();
    const navigate = useNavigate();
    const playlists = usePlaylistStore.use.playlists();
    const { playPlaylist } = usePlaylist();

    const shuffled = useMemo(() => {
        return shuffleArray(songs) as Song[];
    }, [songs]);

    const shortened = useMemo(() => {
        return shuffled.slice(0, Math.min(shuffled.length, 10));
    }, [shuffled]);

    const handlePlayRandomSong = () => {
        if (shuffled.length > 0) {
            playSong(shuffled[0].id);
        }
    };

    const handlePlayRandomPlaylist = () => {
        if (playlists.length > 0) {
            const rand =
                playlists[Math.floor(Math.random() * playlists.length)];
            playPlaylist(rand.id);
        }
    };

    const handlePlayRandomVerse = () => {
        if (shuffled.length > 0) {
            // playSong(shuffled[0].id);
            const song = shuffled[0];
            const verses = splitSongIntoVerses(song.content);
            const randomVerse = (
                verses.length > 0 ? shuffleArray(verses)[0] : ""
            ) as string;

            navigate("/verse", {
                state: { content: randomVerse, id: song.id, cameFrom: "/" },
            });
        }
    };

    return (
        <div
            className={cn("flex w-full items-center justify-center  flex-col ")}
        >
            <h2 className="font-bold text-3xl">No song selected.</h2>
            <div className="flex flex-col justify-center items-center  ">
                {songs.length > 0 && (
                    <div className="space-y-1">
                        <h3 className=" text-muted-foreground mx-auto w-fit text-md mb-8">
                            Here are some of your songs.
                        </h3>

                        <div
                            className={cn(
                                "overflow-hidden w-[100vw] ",
                                isQueueWindowOpen
                                    ? "sm:w-[calc(100vw-16.5rem)]"
                                    : "sm:w-[calc(100vw-1.7rem)]"
                            )}
                        >
                            <SongCarousel songs={shortened} />
                        </div>
                    </div>
                )}
                {/* {songs.length > 0 && (
                    <div className="font-bold text-muted-foreground py-8">
                        or
                    </div>
                )} */}
                <div className="flex flex-col gap-3">
                    {songs.length == 0 && (
                        <div className="flex flex-col justify-center items-center">
                            <span className="text-sm text-muted-foreground">
                                Seems like you don't have any songs yet :/
                            </span>
                            <span className="text-sm text-muted-foreground">
                                No worries you can add some.
                            </span>
                        </div>
                    )}
                    <Link to={"/songs/?tab=add-song"}>
                        <Button
                            className="space-x-2 w-full"
                            variant={"secondary"}
                        >
                            <PlusIcon />
                            <span>Add new song</span>
                        </Button>
                    </Link>
                    <div className="pt-12 gap-2 flex flex-wrap justify-center">
                        <Button
                            className="space-x-2"
                            variant={"outline"}
                            disabled={songs.length == 0}
                            onClick={handlePlayRandomSong}
                        >
                            <PlayIcon />
                            <span>Play random song</span>
                        </Button>
                        <Button
                            className="space-x-2"
                            variant={"outline"}
                            disabled={songs.length == 0}
                            onClick={handlePlayRandomVerse}
                        >
                            <PlayIcon />
                            <span>Play random verse</span>
                        </Button>
                        {playlists.length > 0 && (
                            <Button
                                className="space-x-2"
                                variant={"outline"}
                                disabled={songs.length == 0}
                                onClick={handlePlayRandomPlaylist}
                            >
                                <PlayIcon />
                                <span>Play random playlist</span>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

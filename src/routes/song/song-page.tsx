import BackButton from "@/components/ui/back-button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSongStore } from "@/lib/store/song-store";
import { useParams } from "react-router";
import EditSongForm from "./edit-song-form";
import {
    SongBanner,
    SongDetail,
    SongHeader,
} from "@/components/ui/song-header";
import { Button } from "@/components/ui/button";
import { Pencil1Icon, PlayIcon, PlusIcon } from "@radix-ui/react-icons";
import PlayButton from "@/components/play-button";
import { Link } from "react-router-dom";

export default function SongPage() {
    const songs = useSongStore.use.songs();
    const { songID } = useParams();

    if (!songID) {
        throw Error("No song ID provided.");
    }

    const song = songs.find((x) => x.id == songID);

    // TODO : Could be better
    if (!song)
        return (
            <div className="w-full h-full flex justify-center items-center">
                Sorry could not find this song. It might not exist anymore.
            </div>
        );

    return (
        <div className=" h-[100%]  ">
            <ScrollArea className="h-[100%] px-12 pb-2 rounded-md">
                <div className="flex flex-col items-start justify-start space-y-12 pt-12 w-full ">
                    <BackButton link="/songs" />
                    <div className="space-y-4 w-full">
                        <div>
                            <SongHeader>
                                <SongBanner
                                    song={song}
                                    playButton={false}
                                    size={"extraLarge"}
                                />
                                <div className="flex flex-col justify-center items-start px-8">
                                    <h1 className="text-2xl font-bold">
                                        {song.title}
                                    </h1>
                                    <p className="text-muted-foreground">
                                        {song.source}
                                    </p>
                                    <p>{song.id}</p>
                                </div>
                            </SongHeader>
                        </div>
                        <div className="flex items-center justify-between w-full ">
                            <div className="flex gap-4 border border-dashed p-2 rounded-lg w-fit ">
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
                            {/* <div className="w-fit">
                                <Button
                                    size={"sm"}
                                    variant={"ghost"}
                                    className="space-x-2"
                                >
                                    <PlayIcon />
                                </Button>
                                <Button
                                    size={"sm"}
                                    variant={"ghost"}
                                    className="space-x-2"
                                >
                                    <PlusIcon />{" "}
                                    <span className="text-xs">Queue</span>
                                </Button>
                            </div> */}
                            <div className="w-fit">
                                <Link to={"edit"}>
                                    <Button size={"icon"} variant={"ghost"}>
                                        <Pencil1Icon />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pt-12">
                    <pre className="font-sans">{song.content}</pre>
                </div>
            </ScrollArea>
        </div>
    );
}

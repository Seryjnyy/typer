import { useSongStore } from "@/lib/store/song-store";
import React from "react";
import { useParams } from "react-router";
import EditSongForm from "./edit-song-form";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { ScrollArea } from "@/components/ui/scroll-area";
import BackButton from "@/components/ui/back-button";

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
        <div className=" pt-12 h-[calc(100%-1rem)]">
            <ScrollArea className="h-[calc(100%)] px-12 pb-2">
                <div className="flex flex-col items-start justify-start">
                    <BackButton link="/songs" />
                    <h1 className="text-2xl font-bold py-4">Edit song</h1>
                </div>
                <EditSongForm song={song} />
            </ScrollArea>
        </div>
    );
}

import BackButton from "@/components/ui/back-button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSongStore } from "@/lib/store/song-store";
import { useNavigate, useParams } from "react-router-dom";
import EditSongForm from "./edit-song-form";

export default function EditSong() {
    const songs = useSongStore.use.songs();
    const { songID } = useParams();
    const navigate = useNavigate();

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
        <div className="h-[100%] rounded-md overflow-hidden">
            <ScrollArea className="h-[100%] px-12 pb-2 pt-12">
                <div className="flex flex-col items-start justify-start">
                    <BackButton link="/songs" />
                    <h1 className="text-2xl font-bold py-4">Edit song</h1>
                </div>
                <div className="px-2">
                    <EditSongForm
                        song={song}
                        onSuccess={() => navigate("/songs")}
                    />
                </div>
            </ScrollArea>
        </div>
    );
}

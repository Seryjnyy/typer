import BackButton from "@/components/ui/back-button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSongStore } from "@/lib/store/song-store"
import { useNavigate, useParams } from "react-router-dom"
import SongForm from "@/components/song-form/song-form.tsx"

// TODO : Duplicate code with song page, also very similar code to verse page
const SomethingWentWrong = () => {
    return (
        <div className="flex justify-center items-center h-full flex-col gap-12">
            <div className="text-center">
                <h1 className="text-xl font-semibold">Sorry something went wrong.</h1>
                <p>Please go back and try again.</p>
            </div>
            <BackButton link="/songs" />
        </div>
    )
}

export default function EditSong() {
    const songs = useSongStore.use.songs()
    const { songID } = useParams()
    const navigate = useNavigate()

    if (!songID) {
        throw Error("No song ID provided.")
    }

    const song = songs.find((x) => x.id == songID)

    // TODO : Could be better
    if (!song) return <SomethingWentWrong />

    return (
        <div className="h-[100%] rounded-md overflow-hidden ">
            <ScrollArea className="h-[100%]  sm:pb-2 pb-4 pt-12 ">
                <div className="flex flex-col items-start justify-start  px-2 sm:px-6 md:px-12">
                    <BackButton link="/songs" />
                    <h1 className="text-2xl font-bold py-4">Edit song</h1>
                </div>
                <SongForm initialValues={song} onSuccess={() => navigate("/songs")} />
            </ScrollArea>
        </div>
    )
}

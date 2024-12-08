import BackButton from "@/components/ui/back-button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useMemo } from "react"
import { useParams } from "react-router-dom"
import PlaylistEditForm from "./playlist-edit-form"
import usePlaylists from "@/lib/hooks/use-playlists"

export default function PlaylistEdit() {
    const { playlistID } = useParams()
    const { getPlaylist } = usePlaylists()

    if (!playlistID) {
        throw Error("No playlist ID provided.")
    }

    const playlist = useMemo(() => {
        return getPlaylist(playlistID)
    }, [playlistID])

    if (!playlist) {
        throw Error("No such playlist found.")
    }

    return (
        <div className="h-[100%] rounded-md overflow-hidden">
            <ScrollArea className="h-[100%]  px-2 sm:px-6 md:px-12 sm:pb-2 pb-4 pt-12">
                <div className="flex flex-col items-start justify-start">
                    <BackButton link={`/songs/playlist/${playlistID}`} />
                    <h1 className="text-2xl font-bold py-4">Edit playlist</h1>
                </div>
                <div className="px-2">
                    <PlaylistEditForm playlist={playlist} />
                </div>
            </ScrollArea>
        </div>
    )
}

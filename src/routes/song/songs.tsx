import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusIcon } from "@radix-ui/react-icons"

import { useSearchParams } from "react-router-dom"
import { useSongStore } from "../../lib/store/song-store"

import Playlists from "./playlists"
import SongsList from "./songs-list"
import SongForm from "@/components/song-form/song-form.tsx"

export default function Songs() {
    const [searchParams] = useSearchParams()
    const songs = useSongStore.use.songs()

    let tab = searchParams.get("tab")

    if (tab) {
        if (tab != "all-songs" && tab != "add-song" && tab != "stats" && tab != "playlists") {
            tab = null
        }
    }

    return (
        <Tabs defaultValue={tab ? tab : "all-songs"} className="py-12 h-full ">
            <TabsList className="mx-2 sm:mx-6 md:mx-12">
                <TabsTrigger value={"all-songs"}>Songs</TabsTrigger>

                <TabsTrigger value="add-song" className="flex items-center gap-1">
                    <PlusIcon />
                    Add song
                </TabsTrigger>
                <TabsTrigger value="playlists">Playlists</TabsTrigger>
            </TabsList>
            <TabsContent value="all-songs" className=" h-[100%] px-2 sm:px-6 md:px-12">
                <div className="h-full w-full relative">
                    <SongsList songsList={songs} />
                </div>
            </TabsContent>
            <TabsContent value="playlists" className=" h-[100%] px-2 sm:px-6 md:px-12">
                <Playlists />
            </TabsContent>
            <TabsContent value="add-song" className=" h-[100%] ">
                <SongForm initialValues={undefined} />
            </TabsContent>
        </Tabs>
    )
}

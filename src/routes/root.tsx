import { Outlet } from "react-router"
import BottomNav from "../components/bottom-nav"
import { ThemeProvider } from "../components/theme-provider"
import { Toaster } from "../components/ui/toaster"
import { TooltipProvider } from "../components/ui/tooltip"
import Queue from "../components/queue"
import FloatingSpotifyPlayer from "@/components/spotify-new/player/floating-spotify-player.tsx"

function Root() {
    return (
        <div>
            <ThemeProvider defaultTheme="dark-rose" storageKey="vite-ui-theme">
                <TooltipProvider delayDuration={100}>
                    <div className="h-screen overflow-hidden relative">
                        <FloatingSpotifyPlayer />
                        {/*<TyperSpotifyLink />*/}

                        <div className="flex flex-col h-full justify-end">
                            <main className="flex-grow w-full  flex justify-between z-0 h-[calc(100vh-4rem)]">
                                <div className="z-30 w-full border-none sm:border sm:border-solid sm:my-2 pb-14 sm:pb-0 sm:ml-2 sm:rounded-md">
                                    <Outlet />
                                </div>
                                <div className="z-20 p-2 hidden sm:block ">
                                    <Queue />
                                </div>
                            </main>
                            <nav className="z-20 h-[4rem]">
                                <BottomNav />
                            </nav>
                        </div>
                    </div>
                    <Toaster />
                </TooltipProvider>
            </ThemeProvider>
        </div>
    )
}

// I'm not sure if this is a good approach, but I need to set the spotify track uri to play based on the current song in queue.
// And I previously chose to have Spotify web player

// const TyperSpotifyLink = () => {
//     const currentSong = useCurrentSong()
//     const { setPlayableSong, isSongAlreadyPlaying } = usePlaySongThroughSpotify()
//
//     // If Spotify option enabled, try to set current song
//     useEffect(() => {
//         if (!currentSong) return
//
//         if (!isSongAlreadyPlaying(currentSong.id)) {
//             setPlayableSong(currentSong)
//         }
//     }, [currentSong, isSongAlreadyPlaying, setPlayableSong])
//
//     return null
// }

export default Root

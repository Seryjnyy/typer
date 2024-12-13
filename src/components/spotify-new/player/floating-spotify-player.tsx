import { cn } from "@/lib/utils.ts"
import SpotifyFeatureGuard from "@/components/spotify-new/spotify-feature-guard.tsx"
import SpotifyPlayer from "@/components/spotify-new/player/spotify-player.tsx"
import { GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button.tsx"

// TODO : React rnd
export default function FloatingSpotifyPlayer() {
    return (
        <div
            className={cn(
                "fixed bottom-[4rem] right-0 backdrop-blur-md z-50 p-3  m-3 outline-1 outline rounded-lg max-w-screen-md flex " +
                    " items-center"
            )}
        >
            <SpotifyFeatureGuard>
                <SpotifyPlayer />
            </SpotifyFeatureGuard>
            <div>
                <Button variant={"outline"} size={"icon"} className={"ml-3"}>
                    <GripVertical />
                </Button>
            </div>
        </div>
    )
}

import { Button } from "@/components/ui/button.tsx"
import { Loader2, Pause, Play } from "lucide-react"
import { usePlaybackState, useSpotifyPlayer } from "react-spotify-web-playback-sdk"
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx"

export default function PlaybackControl() {
    const player = useSpotifyPlayer()
    const playbackState = usePlaybackState()

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        onClick={() => player?.togglePlay()}
                        size={"icon"}
                        variant={"secondary"}
                        className={"relative"}
                        disabled={playbackState?.loading}
                    >
                        {!playbackState?.paused && <Pause />}
                        {playbackState?.paused && <Play />}
                        {(playbackState?.loading || !playbackState) && (
                            <div className={"absolute backdrop-blur-sm w-full h-full flex items-center justify-center rounded-lg"}>
                                <Loader2 className={"animate-spin"} />
                            </div>
                        )}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{playbackState?.paused ? "Play" : "Pause"}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

import { Button } from "@/components/ui/button.tsx"
import { Loader2, Pause, Play } from "lucide-react"
import { usePlaybackState, useSpotifyPlayer } from "react-spotify-web-playback-sdk"
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx"
import { SPOTIFY_WEB_PLAYER_SHORTCUTS, useShortcutInfo } from "@/lib/store/shortcuts-store.ts"
import ShortcutKeys from "@/components/shortcut-keys.tsx"

export default function PlaybackControl() {
    const player = useSpotifyPlayer()
    const playbackState = usePlaybackState()
    const shortcutInfo = useShortcutInfo(SPOTIFY_WEB_PLAYER_SHORTCUTS.TOGGLE_PLAYBACK)

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
                <TooltipContent side={"top"} sideOffset={16}>
                    <p>{playbackState?.paused ? "Play" : "Pause"} </p>
                    <ShortcutKeys shortcut={shortcutInfo} />
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

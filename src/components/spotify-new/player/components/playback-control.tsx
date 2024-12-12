import { Button } from "@/components/ui/button.tsx"
import { Pause, Play } from "lucide-react"
import { usePlaybackState, useSpotifyPlayer } from "react-spotify-web-playback-sdk"

export default function PlaybackControl() {
    const player = useSpotifyPlayer()
    const playbackState = usePlaybackState()

    return (
        <Button onClick={() => player?.togglePlay()} size={"icon"} variant={"secondary"}>
            {!playbackState?.paused && <Pause />}
            {playbackState?.paused && <Play />}
        </Button>
    )
}

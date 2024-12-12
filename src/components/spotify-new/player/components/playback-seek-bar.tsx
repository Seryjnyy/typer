import { Slider } from "@/components/ui/slider.tsx"
import { formatDurationMS } from "@/lib/utils.ts"
import { useState } from "react"
import { usePlaybackState, useSpotifyPlayer } from "react-spotify-web-playback-sdk"

export default function PlaybackSeekBar() {
    const spotifyPlayer = useSpotifyPlayer()
    const playbackState = usePlaybackState(true, 1000)
    const [isSeeking, setSeeking] = useState(false)
    const [seekingPosition, setSeekingPosition] = useState(0)

    const position = playbackState?.position ?? 0
    const duration = playbackState?.duration ?? 0

    const handleChange = (val: number) => {
        setSeeking(true)
        setSeekingPosition(val)
    }

    const handleChangeCommit = (val: number) => {
        // set seeking position
        setSeeking(false)
        spotifyPlayer?.seek(val)
    }

    return (
        <div className="flex gap-2">
            <div className="text-xs text-muted-foreground pr-2">{formatDurationMS(position)}</div>

            <Slider
                disabled={playbackState === null}
                value={isSeeking ? [seekingPosition] : [position]}
                max={duration}
                step={1}
                onValueChange={(val) => handleChange(val[0])}
                onValueCommit={(val) => handleChangeCommit(val[0])}
            />
            <div className="text-xs text-muted-foreground pl-2">{formatDurationMS(duration)}</div>
        </div>
    )
}

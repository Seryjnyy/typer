import { Slider } from "@/components/ui/slider.tsx"
import { cn, formatDurationMS } from "@/lib/utils.ts"
import { useEffect, useState } from "react"
import { usePlaybackState, useSpotifyPlayer } from "react-spotify-web-playback-sdk"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { SPOTIFY_WEB_PLAYER_SHORTCUTS, useShortcutInfo } from "@/lib/store/shortcuts-store.ts"

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
        setSeeking(false)
        spotifyPlayer?.seek(val)
    }

    return (
        <div className={"relative"}>
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
            <div className={"text-xs text-muted-foreground w-full flex items-center justify-between px-12 absolute -top-5"}>
                <PlaybackSeekShortcutsInfo />
            </div>
        </div>
    )
}

const PlaybackSeekShortcutsInfo = () => {
    const [hide, setHide] = useState(false)
    const seekForwardShortcut = useShortcutInfo(SPOTIFY_WEB_PLAYER_SHORTCUTS.PLAYBACK_SEEK_FORWARD)
    const seekBackwardShortcut = useShortcutInfo(SPOTIFY_WEB_PLAYER_SHORTCUTS.PLAYBACK_SEEK_BACKWARD)

    // Hide the shortcut info after a certain amount of time, since they clog up the UI
    useEffect(() => {
        const timeout = setTimeout(() => {
            setHide(true)
        }, 3000)

        return () => clearTimeout(timeout)
    }, [])

    return (
        <>
            {seekBackwardShortcut && seekBackwardShortcut.enabled && (
                <span
                    className={cn(" fade-in animate-in  transition-opacity duration-1000 opacity-100 ", {
                        "opacity-0": hide,
                    })}
                >
                    <ArrowLeft className={"size-3 inline"} />
                    (alt + j)
                </span>
            )}
            {seekForwardShortcut && seekForwardShortcut.enabled && (
                <span
                    className={cn(" fade-in animate-in  transition-opacity duration-1000 opacity-100 ", {
                        "opacity-0": hide,
                    })}
                >
                    (alt + l) <ArrowRight className={"size-3 inline"} />
                </span>
            )}
        </>
    )
}

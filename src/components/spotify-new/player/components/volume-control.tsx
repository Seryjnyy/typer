import { Button } from "@/components/ui/button.tsx"
import { Slider } from "@/components/ui/slider.tsx"
import { useQuery } from "@tanstack/react-query"
import { Volume, Volume1, Volume2, VolumeX } from "lucide-react"
import { useRef } from "react"
import { usePlaybackState, useSpotifyPlayer } from "react-spotify-web-playback-sdk"
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx"

export default function VolumeControl() {
    const spotifyPlayer = useSpotifyPlayer()
    const playbackState = usePlaybackState()

    const { data = 0, refetch } = useQuery({
        queryKey: ["PlaybackVolume", playbackState],
        queryFn: () => spotifyPlayer?.getVolume(),
        enabled: !!spotifyPlayer,
    })

    const setVolume = (val: number) => {
        spotifyPlayer?.setVolume(val)
        refetch()
    }
    const volumeBeforeMute = useRef<number>()

    const toggleMute = () => {
        if (volumeBeforeMute.current == undefined) {
            setVolume(0)

            volumeBeforeMute.current = data
        } else {
            setVolume(volumeBeforeMute.current)
            volumeBeforeMute.current = undefined
        }
    }

    const getIcon = () => {
        if (!data) return <VolumeX />

        if (data < 0.33) {
            return <Volume />
        } else if (data > 0.66) {
            return <Volume2 />
        } else if (data == 0) {
            return <VolumeX />
        }

        return <Volume1 />
    }

    return (
        <div className="flex gap-1 items-center">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant={"ghost"} size={"icon"} onClick={toggleMute} disabled={!playbackState}>
                            {getIcon()}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side={"left"}>
                        <p>Mute</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Slider disabled={!playbackState} value={[data ?? 0]} min={0} max={1} step={0.01} onValueChange={(val) => setVolume(val[0])} />
        </div>
    )
}

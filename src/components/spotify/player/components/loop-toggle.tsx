import { usePlaybackState } from "react-spotify-web-playback-sdk"
import { useSpotifyWebSDKContext } from "@/components/spotify/providers/spotify-web-sdk-provider.tsx"
import { Button } from "@/components/ui/button.tsx"
import { LoopIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils.ts"
import { Label } from "@/components/ui/label.tsx"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx"

const REPEAT_MODES_MAP = {
    0: "NO_REPEAT",
    1: "ONCE_REPEAT",
    2: "FULL_REPEAT",
} as const

// TODO : playbackState provides ONCE_REPEAT AND FULL_REPEAT, not 100% sure which is looping the song only, but  i think its okay anyway
//  to use FULL_REPEAT since we only try to play a song at a time not a collection, so it will loop the one song.
//  So hopefully, ONCE_REPEAT and FULL_REPEAT work the same here, because this component currently assumes so, its not tested
const LoopButton = () => {
    const playbackState = usePlaybackState()
    const repeatMode = playbackState?.repeat_mode ? REPEAT_MODES_MAP[playbackState.repeat_mode] : REPEAT_MODES_MAP[0]
    const webSDK = useSpotifyWebSDKContext()

    const toggleRepeat = () => {
        if (repeatMode === "NO_REPEAT") {
            webSDK?.player.setRepeatMode("track")
        } else if (repeatMode === "FULL_REPEAT" || repeatMode === "ONCE_REPEAT") {
            webSDK?.player.setRepeatMode("off")
        }
    }

    const isLoop = repeatMode === "FULL_REPEAT" || repeatMode === "ONCE_REPEAT"

    return (
        <div className={"flex items-center justify-start gap-1"}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild={true}>
                        <Button size={"icon"} variant={"outline"} onClick={toggleRepeat}>
                            <LoopIcon className={cn({ "text-[#1DB954] ": isLoop })} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side={"right"}>
                        <p>{isLoop ? "Don't repeat track" : "Repeat track"}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Label className={"text-muted-foreground"}>Repeat is {isLoop ? "on" : "off"}</Label>
        </div>
    )
}

export default LoopButton

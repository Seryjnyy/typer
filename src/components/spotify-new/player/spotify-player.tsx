import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx"
import { ReactNode, useState } from "react"
import SpotifyWebSDKProvider from "@/components/spotify-new/providers/spotify-web-sdk-provider.tsx"
import SpotifyAccessTokenProvider from "@/components/spotify-new/providers/spotify-access-token-provider.tsx"
import SpotifyWebPlayerSDKProvider from "@/components/spotify-new/providers/spotify-web-player-sdk-provider.tsx"
import { Button } from "@/components/ui/button.tsx"
import MyDevices from "@/components/spotify-new/player/components/my-devices.tsx"
import { usePlaybackState, usePlayerDevice, useWebPlaybackSDKReady } from "react-spotify-web-playback-sdk"
import { useColor } from "color-thief-react"
import { ReloadIcon } from "@radix-ui/react-icons"
import PlaybackControl from "@/components/spotify-new/player/components/playback-control.tsx"
import { Menu, XIcon } from "lucide-react"
import PlaybackSeekBar from "@/components/spotify-new/player/components/playback-seek-bar.tsx"
import VolumeControl from "@/components/spotify-new/player/components/volume-control.tsx"
import { Progress } from "@/components/ui/progress.tsx"
import { usePlayback } from "@/components/spotify-new/player/use-playback.ts"
import LoadingMessage from "@/components/spotify-new/loading-message.tsx"
import LoopToggle from "@/components/spotify-new/player/components/loop-toggle.tsx"
import { cn } from "@/lib/utils.ts"

const SpotifyPlayer = () => {
    return (
        <WebPlayerProvider>
            <WebPlayerContent />
        </WebPlayerProvider>
    )
}

const WebPlayerProvider = ({ children }: { children: ReactNode }) => {
    return (
        <SpotifyWebSDKProvider>
            <SpotifyAccessTokenProvider>
                <SpotifyWebPlayerSDKProvider>{children}</SpotifyWebPlayerSDKProvider>
            </SpotifyAccessTokenProvider>
        </SpotifyWebSDKProvider>
    )
}

const WebPlayerContent = () => {
    const webPlaybackSDKReady = useWebPlaybackSDKReady()
    const [open, setOpen] = useState(true)
    const device = usePlayerDevice()
    usePlayback()

    if (!webPlaybackSDKReady || !device) return <LoadingMessage />

    if (!open)
        return (
            <>
                <div className=" rounded-lg    flex flex-col gap-2  relative ">
                    <div className={" flex items-center gap-3 "}>
                        <CurrentTrackDetail smallVersion={true} />
                        <PlaybackControl />
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button size={"icon"} variant={"outline"} onClick={() => setOpen((prev) => !prev)}>
                                        <ReloadIcon />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side={"top"} sideOffset={16}>
                                    <p>Reset track</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button size={"icon"} variant={"outline"} onClick={() => setOpen((prev) => !prev)}>
                                        <Menu />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side={"top"} sideOffset={16}>
                                    <p>Maximise</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className={"absolute  w-full  rounded-lg -bottom-3 "}>
                        <SongProgressBar />
                    </div>
                </div>
                <BackgroundGradientFromTrack className={"left-0"} />
            </>
        )

    return (
        <div className="flex flex-col justify-end gap-4  rounded-lg relative  w-[40rem] ">
            <div className={"flex justify-between items-center"}>
                <CurrentTrackDetail />
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button className={"ml-auto"} variant={"outline"} size={"icon"} onClick={() => setOpen((prev) => !prev)}>
                                <XIcon />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side={"left"}>
                            <p>Minimise</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <div className="grid grid-cols-2 ">
                <div className="justify-self-end">
                    <PlaybackControl />
                </div>
                <div className="justify-self-end">
                    <MyDevices />
                </div>
            </div>
            <PlaybackSeekBar />
            <div className="flex justify-between">
                <LoopToggle />
                <div className={"w-[10rem]"}>
                    <VolumeControl />
                </div>
            </div>
        </div>
    )
}

const SongProgressBar = () => {
    const playbackState = usePlaybackState(true, 1000)
    const position = playbackState?.position ?? 0
    const duration = playbackState?.duration ?? 0
    const progress = duration === 0 ? 0 : (position / duration) * 100

    return <Progress value={progress} className={"h-1 bg-transparent rounded-b-lg"} />
}

const CurrentTrackDetail = ({ smallVersion }: { smallVersion?: boolean }) => {
    const playbackState = usePlaybackState()

    const currentTrack = playbackState?.track_window.current_track

    if (!currentTrack) return null

    if (smallVersion) return <img src={currentTrack.album.images[0].url} alt={currentTrack.album.name} className="size-8 rounded-md" />

    return (
        <div className="flex items-center gap-2">
            <img src={currentTrack.album.images[0].url} alt={currentTrack.album.name} className="size-8 rounded-md" />
            <div className="flex flex-col">
                <div>{currentTrack.name}</div>
                <div className="text-xs text-muted-foreground">{currentTrack.artists.map((artist) => artist.name).join(", ")}</div>
            </div>
        </div>
    )
}

const BackgroundGradientFromTrack = ({ className }: { className?: string }) => {
    const playbackState = usePlaybackState()

    const currentTrack = playbackState?.track_window.current_track
    const { data, loading, error } = useColor(currentTrack?.album.images[0].url ?? "", "hex", {
        crossOrigin: "anonymous",
    })

    if (currentTrack === null || !data || error || loading) return null

    return (
        <div
            className={cn("w-full h-full absolute left-0 top-0  -z-10 opacity-60 rounded-lg ", className)}
            style={{
                backgroundImage: `linear-gradient(to bottom, ${data}, transparent)`,
            }}
        ></div>
    )
}

export default SpotifyPlayer

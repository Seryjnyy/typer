import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx"
import { ReactNode } from "react"
import SpotifyWebSDKProvider from "@/components/spotify-new/providers/spotify-web-sdk-provider.tsx"
import SpotifyAccessTokenProvider from "@/components/spotify-new/providers/spotify-access-token-provider.tsx"
import SpotifyWebPlayerSDKProvider from "@/components/spotify-new/providers/spotify-web-player-sdk-provider.tsx"
import { Button } from "@/components/ui/button.tsx"
import MyDevices from "@/components/spotify-new/player/components/my-devices.tsx"
import { usePlaybackState, usePlayerDevice, useSpotifyPlayer, useWebPlaybackSDKReady } from "react-spotify-web-playback-sdk"
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
import { useHotkeys } from "react-hotkeys-hook"
import { debounce } from "lodash"
import { SPOTIFY_WEB_PLAYER_SHORTCUTS, useShortcutInfo } from "@/lib/store/shortcuts-store.ts"
import ShortcutKeys from "@/components/shortcut-keys.tsx"
import { useIsSpotifyPlayerOpen } from "@/components/spotify-new/player/spotify-player-state.ts"

const SpotifyPlayer = () => {
    return (
        <WebPlayerProvider>
            <WithWebPlayerShortcuts>
                <WebPlayerContent />
            </WithWebPlayerShortcuts>
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

const RestartPlaybackButton = () => {
    const spotifyPlayer = useSpotifyPlayer()
    const shortcutInfo = useShortcutInfo(SPOTIFY_WEB_PLAYER_SHORTCUTS.RESTART_PLAYBACK)

    const handleReset = () => {
        spotifyPlayer?.seek(0)
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button size={"icon"} variant={"outline"} onClick={handleReset}>
                        <ReloadIcon />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side={"top"} sideOffset={16}>
                    <p>Reset track</p>
                    <ShortcutKeys shortcut={shortcutInfo} />
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

const RestartPlaybackShortcut = () => {
    const spotifyPlayer = useSpotifyPlayer()
    const shortcut = useShortcutInfo(SPOTIFY_WEB_PLAYER_SHORTCUTS.RESTART_PLAYBACK)

    useHotkeys(
        shortcut?.hotkeys.join(",") ?? "",
        (e) => {
            e.preventDefault()
            spotifyPlayer?.seek(0)
        },
        {
            enabled: shortcut?.enabled ?? false,
            enableOnFormTags: true,
        }
    )

    return null
}

const TogglePlaybackShortcut = () => {
    const spotifyPlayer = useSpotifyPlayer()
    const shortcut = useShortcutInfo(SPOTIFY_WEB_PLAYER_SHORTCUTS.TOGGLE_PLAYBACK)

    useHotkeys(
        shortcut?.hotkeys.join(",") ?? "",
        (e) => {
            e.preventDefault()
            spotifyPlayer?.togglePlay()
        },
        {
            enabled: shortcut?.enabled ?? false,
            enableOnFormTags: true,
        }
    )

    return null
}

const SEEK_AMOUNT = 10000

const SeekShortcuts = () => {
    const spotifyPlayer = useSpotifyPlayer()
    const seekForwardShortcut = useShortcutInfo(SPOTIFY_WEB_PLAYER_SHORTCUTS.PLAYBACK_SEEK_FORWARD)
    const seekBackwardShortcut = useShortcutInfo(SPOTIFY_WEB_PLAYER_SHORTCUTS.PLAYBACK_SEEK_BACKWARD)

    const seek = debounce((amount: number) => {
        spotifyPlayer?.seek(amount)
    }, 300)

    // Could be improved but leaving as is for now.
    // Make it so holding down the shortcut seeks the song proportionally, the longer the hold the larger the seek amount.

    const seekShortcut = async (amount: number) => {
        const currentState = await spotifyPlayer?.getCurrentState()

        if (!currentState) return

        const duration = currentState.duration
        const position = currentState.position

        if (position + amount < 0 || position + amount > duration) return

        seek(position + amount)
    }

    useHotkeys(
        seekBackwardShortcut?.hotkeys.join(",") ?? "",
        (e) => {
            e.preventDefault()
            seekShortcut(-SEEK_AMOUNT)
        },
        {
            enabled: seekBackwardShortcut?.enabled ?? false,
            enableOnFormTags: true,
        }
    )

    useHotkeys(
        seekForwardShortcut?.hotkeys.join(",") ?? "",
        (e) => {
            e.preventDefault()
            seekShortcut(SEEK_AMOUNT)
        },
        {
            enabled: seekForwardShortcut?.enabled ?? false,
            enableOnFormTags: true,
        }
    )

    return null
}

const WithWebPlayerShortcuts = ({ children }: { children: ReactNode }) => {
    return (
        <>
            {children}
            <TogglePlaybackShortcut />
            <SeekShortcuts />
            <RestartPlaybackShortcut />
        </>
    )
}

const WebPlayerContent = () => {
    const webPlaybackSDKReady = useWebPlaybackSDKReady()
    const [open, setOpen] = useIsSpotifyPlayerOpen()
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
                        <RestartPlaybackButton />
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
                <BackgroundGradientFromTrack />
            </>
        )

    return (
        <>
            <div className="flex flex-col justify-end gap-4  rounded-lg relative  w-full ">
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
            <BackgroundGradientFromTrack />
        </>
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

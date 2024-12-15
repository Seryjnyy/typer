import { useEffect, useRef } from "react"
import { useSpotifyWebSDKContext } from "@/components/spotify/providers/spotify-web-sdk-provider.tsx"
import { usePlaybackState, usePlayerDevice } from "react-spotify-web-playback-sdk"
import { useCurrentSong } from "@/components/typer/use-current-song.ts"

// Acts as link between typer songs and Spotify web player track
// I don't know how I feel about this tbh :/
// Better than the mess that it was before tho
export const usePlayback = () => {
    const webSDK = useSpotifyWebSDKContext()

    const playbackState = usePlaybackState()
    const thisDevice = usePlayerDevice()
    const currentSong = useCurrentSong()
    const requestPending = useRef<boolean>(false)

    useEffect(() => {
        // If no current song, or current song doesn't have Spotify link
        if (!currentSong || !currentSong.spotifyUri) return

        // If device is not initialised
        if (!thisDevice) return

        // If song is already playing
        if (playbackState?.track_window.current_track.uri == currentSong.spotifyUri) return

        const startPlayback = async () => {
            if (requestPending.current == true) return

            requestPending.current = true
            await webSDK.player.startResumePlayback(thisDevice.device_id, undefined, [currentSong.spotifyUri!])
            requestPending.current = false
        }

        startPlayback()
    }, [currentSong, playbackState?.track_window.current_track.uri, thisDevice, webSDK.player])
}

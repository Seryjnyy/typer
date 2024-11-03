import {
    usePlaybackState,
    usePlayerDevice,
} from "react-spotify-web-playback-sdk";
import { useSpotify } from "./use-spotify";

export default function usePlaySongURI(uri: string) {
    const { apiSDK } = useSpotify({});
    const playbackState = usePlaybackState();
    const thisDevice = usePlayerDevice();

    const isPlayingURI = playbackState?.track_window.current_track.uri == uri;

    const togglePlayURI = () => {
        if (!thisDevice || !apiSDK || isPlayingURI) return;

        apiSDK.player.startResumePlayback(thisDevice.device_id, undefined, [
            uri,
        ]);
    };

    return { togglePlayURI, isPlayingURI };
}

import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";
import {
    usePlaybackState,
    useSpotifyPlayer,
} from "react-spotify-web-playback-sdk";

export default function PlaybackControl() {
    const player = useSpotifyPlayer();
    const playbackState = usePlaybackState();

    return (
        <div>
            <div>
                <Button onClick={() => player?.togglePlay()} size={"icon"}>
                    {!playbackState?.paused && <Pause />}
                    {playbackState?.paused && <Play />}
                </Button>
            </div>
        </div>
    );
}

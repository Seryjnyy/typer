import SpotifyEnable from "./components/spotify/spotify-enable";
import SpotifyPlayer from "./spotify/spotify-player";

export default function TestPage2() {
    return (
        <div>
            <SpotifyEnable redirectPath={"test"} />
            {/* <EnableSpotifyWebPlayer /> */}
            <SpotifyPlayer />
        </div>
    );
}

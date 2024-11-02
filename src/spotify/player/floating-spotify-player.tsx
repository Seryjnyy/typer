import SpotifyPlayer from "./spotify-player";

export default function FloatingSpotifyPlayer() {
    return (
        <div className="fixed bottom-[4rem] left-0 backdrop-blur-md z-50 w-full m-3 outline max-w-screen-md">
            <SpotifyPlayer />
        </div>
    );
}

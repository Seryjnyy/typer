import { Button } from "@/components/ui/button";
import { ReactNode, useEffect, useState } from "react";
import {
    usePlaybackState,
    useSpotifyPlayer,
    useWebPlaybackSDKReady,
    WebPlaybackSDK,
} from "react-spotify-web-playback-sdk";
import MyDevices from "./my-devices";
import PlaybackSeekBar from "./playback-seek-bar";
import VolumeControl from "./volume-control";
import { useAvailableDevices } from "../spotify-api";
import { useSpotify } from "../use-spotify";
import PlaybackControl from "./playback-control";
import SpotifyEnable from "@/components/spotify/spotify-enable";

export default function SpotifyPlayer() {
    return (
        <div className="p-3 ">
            <WithSpotifySDK render={() => <Player />} />
        </div>
    );
}

const Player = () => {
    return (
        <WithAccessToken
            render={(accessToken) => (
                <WebPlaybackSDK
                    connectOnInitialized={true}
                    initialDeviceName="typer"
                    initialVolume={0.5}
                    getOAuthToken={(callback) => callback(accessToken)}
                >
                    <Testing />
                </WebPlaybackSDK>
            )}
        />
    );
};

const Testing = () => {
    const webPlaybackSDKReady = useWebPlaybackSDKReady();

    if (!webPlaybackSDKReady) return <div>Loading...</div>;

    return (
        <div className="flex flex-col gap-4">
            <CurrentTrack />
            <div className="grid grid-cols-2 ">
                <div className="justify-self-end">
                    <PlaybackControl />
                </div>
                <div className="justify-self-end">
                    <MyDevices />
                </div>
            </div>
            <PlaybackSeekBar />
            <div className="w-[10rem] ml-auto">
                <VolumeControl />
            </div>

            {/* <ConnectButton /> */}
        </div>
    );
};

// This only shows playback when the device is active
const CurrentTrack = () => {
    const playbackState = usePlaybackState();

    const currentTrack = playbackState?.track_window.current_track;

    if (!currentTrack) return null;

    return (
        <div className="flex items-center gap-2">
            <img
                src={currentTrack.album.images[0].url}
                alt={currentTrack.album.name}
                className="size-8 rounded-md"
            />
            <div className="flex flex-col">
                <div>{currentTrack.name}</div>
                <div className="text-xs text-muted-foreground">
                    {currentTrack.artists
                        .map((artist) => artist.name)
                        .join(", ")}
                </div>
            </div>
        </div>
    );
};

// TODO : idk if i need a manual connect button yet, will leave it here for now
const ConnectButton = () => {
    // TODO : refetch for now, but should probably use queryClient.invalidateQueries
    const { refetch } = useAvailableDevices();
    const player = useSpotifyPlayer();

    const handleConnect = () => {
        player?.connect();
        // player?.getCurrentState().then((state) => {
        //     console.log(state);
        // });

        refetch();
    };

    return <Button onClick={handleConnect}>Connect</Button>;
};

const WithSpotifySDK = ({ render }: { render: (apiSDK: any) => ReactNode }) => {
    const { apiSDK } = useSpotify({ redirectPath: "test" });

    // TODO : This needs doing properly
    // It needs spotify enable to authenticate the app, set the apiSDK
    // the redirect is not good, and idk how it looks UI wise rn
    if (!apiSDK) return <SpotifyEnable redirectPath="/songs?tab=add-song" />;

    return <>{render(apiSDK)}</>;
};

const WithAccessToken = ({
    render,
}: {
    render: (accessToken: string) => ReactNode;
}) => {
    const [accessToken, setAccessToken] = useState("");
    const { apiSDK, getAccessToken } = useSpotify({});

    useEffect(() => {
        const setUp = async () => {
            if (!apiSDK) return;
            const accessToken = await getAccessToken();
            if (accessToken) {
                setAccessToken(accessToken);
            }
        };

        setUp();
    }, [apiSDK, getAccessToken]);

    if (!accessToken) return <div>No access token.</div>;

    return <>{render(accessToken)}</>;
};

import { Button } from "@/components/ui/button";
import { ReactNode, useEffect, useState } from "react";
import {
    useSpotifyPlayer,
    WebPlaybackSDK,
} from "react-spotify-web-playback-sdk";
import { useAvailableDevices } from "./spotify-api";
import { useSpotify } from "./use-spotify";

export default function SpotifyPlayer() {
    return (
        <div className="p-3 border m-3">
            <WithSpotifySDK render={(apiSDK) => <Player />} />
        </div>
    );
}

const Player = () => {
    return (
        <div className="p-2 border">
            <WithAccessToken
                render={(accessToken) => (
                    <WebPlaybackSDK
                        initialDeviceName="typer"
                        initialVolume={0.5}
                        getOAuthToken={(callback) => callback(accessToken)}
                    >
                        <Testing />
                    </WebPlaybackSDK>
                )}
            />
        </div>
    );
};

const Testing = () => {
    return (
        <div>
            <ConnectButton />
        </div>
    );
};

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

    if (!apiSDK) return null;

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

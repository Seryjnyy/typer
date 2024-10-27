import { Button } from "@/components/ui/button";
import { useSpotify } from "@/spotify/use-spotify";
import { Check, Cross, Music, XIcon } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function SpotifyEnable() {
    let [searchParams] = useSearchParams();

    const isCodeSearchParam = searchParams.get("code") ? true : false;
    const isTokenInLocalStorage =
        localStorage.getItem(
            "spotify-sdk:AuthorizationCodeWithPKCEStrategy:token"
        ) !== null
            ? true
            : false;

    const [enabled, setEnabled] = useState(
        isCodeSearchParam || isTokenInLocalStorage
    );

    const { isReady } = useSpotify({
        enabled: enabled,
    });

    return (
        <div className="border px-6 py-1 flex items-center gap-3 w-fit  rounded-3xl ">
            <div className="flex gap-1 justify-between">
                <img
                    src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png"
                    className="w-6 relative block"
                />
                {isReady ? (
                    <Check className="size-6 text-muted-foreground" />
                ) : (
                    <XIcon className="size-6 text-muted-foreground" />
                )}
            </div>
            {!isReady && (
                <div className="w-full justify-center flex">
                    <Button onClick={() => setEnabled(true)}>Enable</Button>
                </div>
            )}
        </div>
    );
}

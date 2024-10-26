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
        <div className="border p-3 flex items-center gap-3 min-w-[9rem] max-w-[9rem] rounded-md">
            <div className="flex gap-1">
                <Music className="size-4" />
                {isReady ? (
                    <Check className="size-4" />
                ) : (
                    <XIcon className="size-4" />
                )}
            </div>
            <div className="w-full justify-center flex">
                {!isReady ? (
                    <Button onClick={() => setEnabled(true)}>Enable</Button>
                ) : (
                    "Ready"
                )}
            </div>
        </div>
    );
}

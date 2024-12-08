import { Button } from "@/components/ui/button"
import { RedirectPath, useSpotify } from "@/spotify/use-spotify"
import { Check, XIcon } from "lucide-react"
import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Icons } from "../icons"

// TODO : Error, idk how major it is
// POST https://accounts.spotify.com/api/token 500 (Internal Server Error)
// use-spotify.ts:32 Error: Failed to refresh token: , {"error":"server_error","error_description":"Failed to remove token"}
export default function SpotifyEnable({ redirectPath }: { redirectPath: RedirectPath }) {
    const [searchParams] = useSearchParams()

    const isCodeSearchParam = searchParams.get("code") ? true : false
    const isTokenInLocalStorage = localStorage.getItem("spotify-sdk:AuthorizationCodeWithPKCEStrategy:token") !== null ? true : false

    const [enabled, setEnabled] = useState(isCodeSearchParam || isTokenInLocalStorage)

    const { isReady } = useSpotify({
        enabled: enabled,
        redirectPath: redirectPath,
    })

    return (
        <div className="border px-6 py-1 flex items-center gap-3 w-fit  rounded-3xl ">
            <div className="flex gap-1 justify-between">
                <Icons.spotify className="size-6 " />
                {isReady ? <Check className="size-6 text-muted-foreground" /> : <XIcon className="size-6 text-muted-foreground" />}
            </div>
            {!isReady && (
                <div className="w-full justify-center flex">
                    <Button onClick={() => setEnabled(true)} type="button">
                        Enable
                    </Button>
                </div>
            )}
        </div>
    )
}

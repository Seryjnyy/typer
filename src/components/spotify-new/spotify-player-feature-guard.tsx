import { Button } from "@/components/ui/button.tsx"
import { ReactNode } from "react"
import { Icons } from "@/components/icons.tsx"
import { useIsSpotifyPlayerEnabled } from "@/components/spotify-new/player/spotify-player-state.ts"

// Currently only used in the settings page, not sure if its really needed, but will leave this as is for now
function SpotifyPlayerFeatureGuard({
    children,
    returnEnable = true,
    returnDisable = false,
}: {
    children: ReactNode
    returnEnable?: boolean
    returnDisable?: boolean
}) {
    const [isSpotifyPlayerEnabled, setIsSpotifyPlayerEnabled] = useIsSpotifyPlayerEnabled()

    if (!isSpotifyPlayerEnabled && returnEnable) {
        return (
            <div>
                <Button
                    type={"button"}
                    onClick={() => setIsSpotifyPlayerEnabled(true)}
                    variant={"secondary"}
                    className={"flex items-center  gap-2 w-full"}
                >
                    <Icons.spotify className={"size-4"} /> Enable Spotify Player
                </Button>
            </div>
        )
    }

    if (!isSpotifyPlayerEnabled && !returnEnable) return null

    if (returnDisable)
        return (
            <>
                {children}
                <Button
                    type={"button"}
                    variant={"secondary"}
                    className={"flex items-center  gap-2 w-full"}
                    onClick={() => setIsSpotifyPlayerEnabled(false)}
                >
                    <Icons.spotify className={"size-4"} /> Disable Spotify Player
                </Button>
            </>
        )

    return children
}

export default SpotifyPlayerFeatureGuard

import { Button } from "@/components/ui/button.tsx"
import { ReactNode } from "react"
import { Icons } from "@/components/icons.tsx"
import { useIsSpotifyEnabled } from "@/components/spotify-new/spotify-state.ts"

function SpotifyFeatureGuard({
    children,
    returnEnable = true,
    returnDisable = false,
}: {
    children: ReactNode
    returnEnable?: boolean
    returnDisable?: boolean
}) {
    const [isSpotifyEnabled, setIsSpotifyEnabled] = useIsSpotifyEnabled()

    if (!isSpotifyEnabled && returnEnable) {
        return (
            <Button type={"button"} onClick={() => setIsSpotifyEnabled(true)} variant={"secondary"} className={"flex items-center gap-2"}>
                <Icons.spotify className={"size-4"} /> Turn on Spotify
            </Button>
        )
    }

    if (!isSpotifyEnabled && !returnEnable) return null

    if (returnDisable)
        return (
            <>
                {children}
                <Button
                    type={"button"}
                    variant={"secondary"}
                    className={"flex items-center  gap-2"}
                    onClick={() => setIsSpotifyEnabled(false)}
                >
                    <Icons.spotify className={"size-4"} /> Turn off Spotify
                </Button>
            </>
        )

    return children
}

export default SpotifyFeatureGuard

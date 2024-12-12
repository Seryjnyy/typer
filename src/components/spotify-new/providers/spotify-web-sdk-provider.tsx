import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { useSpotifyWebSDK } from "@/components/spotify-new/use-spotify-web-sdk.ts"
import { Button } from "@/components/ui/button.tsx"
import { SpotifyApi } from "@spotify/web-api-ts-sdk"
import { Icons } from "@/components/icons.tsx"
import LoadingMessage from "@/components/spotify-new/loading-message.tsx"

const SpotifyWebSDKContext = createContext<SpotifyApi | null>(null)
export const useSpotifyWebSDKContext = () => {
    const context = useContext(SpotifyWebSDKContext)
    if (!context) {
        throw new Error("useSpotifyWebSDK must be used within a SpotifyWebSDKProvider")
    }
    return context
}

const SpotifyWebSDKProvider = ({ children }: { children: ReactNode }) => {
    const { clientSDK, isSDKAuthenticated, connectSDK } = useSpotifyWebSDK()
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined)

    useEffect(() => {
        const checkIfAuthenticated = async () => {
            setIsAuthenticated(await isSDKAuthenticated())
        }

        checkIfAuthenticated()
    }, [isSDKAuthenticated])

    if (isAuthenticated === undefined) return <LoadingMessage />

    if (isAuthenticated === false)
        return (
            <div>
                <Button type="button" onClick={connectSDK} className={"flex items-center gap-2"} variant={"secondary"}>
                    <Icons.spotify className={"size-4"} /> Connect
                </Button>
            </div>
        )

    if (!clientSDK)
        return (
            <div className={"text-xs text-muted-foreground"}>
                SpotifyWebSDK is missing. <br /> Something went wrong.
            </div>
        )

    return <SpotifyWebSDKContext.Provider value={clientSDK}>{children}</SpotifyWebSDKContext.Provider>
}

export default SpotifyWebSDKProvider

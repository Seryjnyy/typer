import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { AccessToken } from "@spotify/web-api-ts-sdk"
import { useSpotifyWebSDKContext } from "@/components/spotify/providers/spotify-web-sdk-provider.tsx"
import LoadingMessage from "@/components/spotify/loading-message.tsx"

const SpotifyAccessTokenContext = createContext<AccessToken | null>(null)

export const useSpotifyAccessTokenContext = () => {
    const context = useContext(SpotifyAccessTokenContext)
    if (!context) {
        throw new Error("useSpotifyAccessToken must be used within a SpotifyAccessTokenProvider")
    }
    return context
}

const SpotifyAccessTokenProvider = ({ children }: { children: ReactNode }) => {
    const webSDK = useSpotifyWebSDKContext()
    const [accessToken, setAccessToken] = useState<AccessToken | null>(null)

    useEffect(() => {
        const getAccessToken = async () => {
            setAccessToken(await webSDK.getAccessToken())
        }
        getAccessToken()
    }, [webSDK])

    if (accessToken === null) return <LoadingMessage />

    return <SpotifyAccessTokenContext.Provider value={accessToken}>{children}</SpotifyAccessTokenContext.Provider>
}

export default SpotifyAccessTokenProvider

import { ReactNode } from "react"
import { useSpotifyAccessTokenContext } from "@/components/spotify-new/providers/spotify-access-token-provider.tsx"
import { WebPlaybackSDK } from "react-spotify-web-playback-sdk"

const SpotifyWebPlayerSDKProvider = ({ children }: { children: ReactNode }) => {
    const accessToken = useSpotifyAccessTokenContext()
    return (
        <WebPlaybackSDK
            initialDeviceName={"typer"}
            getOAuthToken={(callback) => callback(accessToken.access_token)}
            connectOnInitialized={true}
            initialVolume={0.5}
        >
            {children}
        </WebPlaybackSDK>
    )
}

export default SpotifyWebPlayerSDKProvider

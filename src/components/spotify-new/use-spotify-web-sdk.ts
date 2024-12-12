import { atom, useAtom } from "jotai/index"
import { Scopes, SpotifyApi } from "@spotify/web-api-ts-sdk"
import { useEffect } from "react"

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string
const redirectUrl = import.meta.env.VITE_SPOTIFY_BASE_REDIRECT_URL as string
const scopes = Scopes.all

const clientSDK = atom<SpotifyApi | null>(null)
const useClientSDK = () => useAtom(clientSDK)

export const useSpotifyWebSDK = () => {
    const [clientSDK, setClientSDK] = useClientSDK()

    // Create SDK
    useEffect(() => {
        // TODO : Need to test. library says it uses refresh tokens, so every hour it should get a new access token automatically, but I
        //  haven't tested that yet. Coming back to the site after a while does cause a redirect tho, but that might be because the
        //  refresh token is no longer valid since the access token it came with expired
        if (!clientSDK) {
            const sdk = SpotifyApi.withUserAuthorization(clientId, redirectUrl + "/test", scopes, {})
            setClientSDK(sdk)
        }

        // I don't think you have to "close" this SDK or anything right??
    }, [clientSDK, setClientSDK])

    // Manual authentication
    const connectSDK = async () => {
        if (!clientSDK) return
        const res = await clientSDK?.authenticate()
        return res.authenticated
    }

    const isSDKAuthenticated = async () => {
        if (!clientSDK) return false
        const token = await clientSDK?.getAccessToken()
        if (!token) return false

        // Check if expired
        return !(token.expires && token.expires <= Date.now())
    }

    return {
        clientSDK,
        connectSDK,
        isSDKAuthenticated,
    }
}

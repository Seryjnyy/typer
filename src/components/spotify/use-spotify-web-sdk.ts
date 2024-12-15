import { atom, useAtom } from "jotai/index"
import { Scopes, SpotifyApi } from "@spotify/web-api-ts-sdk"
import { useCallback, useEffect } from "react"

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string
const scopes = [...Scopes.userPlayback, ...Scopes.userPlaybackRead, ...Scopes.userPlaybackModify]

// Singleton
const clientSDK = atom<SpotifyApi | null>(null)
const useClientSDK = () => useAtom(clientSDK)

const isAuthenticatedAtom = atom<boolean | undefined>(undefined)
const useIsAuthenticatedAtom = () => useAtom(isAuthenticatedAtom)

// When using this hook the auth functions on the sdk should not be used, instead use the functions provided by the hook because it keeps
// track of isAuthenticated state, and the client functions will not update it
export const useSpotifyWebSDK = () => {
    const [clientSDK, setClientSDK] = useClientSDK()
    const [isAuthenticated, setIsAuthenticated] = useIsAuthenticatedAtom()

    const checkIsSDKAuthenticated = useCallback(async () => {
        if (!clientSDK) {
            setIsAuthenticated(false)
            return
        }
        const token = await clientSDK?.getAccessToken()
        if (!token) {
            setIsAuthenticated(false)
            return
        }

        if (token.expires && token.expires <= Date.now()) {
            setIsAuthenticated(false)
            return
        }

        setIsAuthenticated(true)
    }, [clientSDK, setIsAuthenticated])

    // Create SDK
    useEffect(() => {
        // TODO : Need to test. library says it uses refresh tokens, so every hour it should get a new access token automatically, but I
        //  haven't tested that yet. Coming back to the site after a while does cause a redirect tho, but that might be because the
        //  refresh token is no longer valid since the access token it came with expired
        if (!clientSDK) {
            const sdk = SpotifyApi.withUserAuthorization(clientId, window.location.origin + "/settings/spotify", scopes, {})
            setClientSDK(sdk)
            checkIsSDKAuthenticated()
        }

        // I don't think you have to "close" this SDK or anything right??
    }, [checkIsSDKAuthenticated, clientSDK, setClientSDK])

    // Manual authentication
    const connectSDK = useCallback(async () => {
        if (!clientSDK) return

        await clientSDK?.authenticate()
        checkIsSDKAuthenticated()
    }, [checkIsSDKAuthenticated, clientSDK])

    const disconnectSDK = useCallback(() => {
        if (!clientSDK) return

        clientSDK.logOut()
        checkIsSDKAuthenticated()
    }, [checkIsSDKAuthenticated, clientSDK])

    return {
        clientSDK,
        connectSDK,
        disconnectSDK,
        isAuthenticated,
    }
}

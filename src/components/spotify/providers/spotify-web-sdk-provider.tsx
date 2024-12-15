import { createContext, ReactNode, useContext, useEffect } from "react"
import { useSpotifyWebSDK } from "@/components/spotify/use-spotify-web-sdk.ts"
import { Button } from "@/components/ui/button.tsx"
import { SpotifyApi } from "@spotify/web-api-ts-sdk"
import { Icons } from "@/components/icons.tsx"
import LoadingMessage from "@/components/spotify/loading-message.tsx"
import { useLocation, useNavigate } from "react-router-dom"

const SpotifyWebSDKContext = createContext<SpotifyApi | null>(null)
export const useSpotifyWebSDKContext = () => {
    const context = useContext(SpotifyWebSDKContext)
    if (!context) {
        throw new Error("useSpotifyWebSDK must be used within a SpotifyWebSDKProvider")
    }
    return context
}

// TODO : All of this is becoming very messy, using providers and context maybe wasn't the right choice idk
//  This component now also checks for a spotify code that you get after a successful auth redirect, it uses that to to call connectSDK
//  automatically so the sdk consumes the code and saves the token.
//   Its doing too much now, it provides the sdk, it provides buttons, its part of the auth process now too

// Auto authenticate is only for the spotify settings page so that it does auto authentication when redirect back from Spotify
// The boolean is there because there can be multiple instances of this component on the same page, so the settings page.
//
// This component is like a convenient wrapper around the useSpotifyWebSDK but through context this provides a guaranteed SDK, and
// checks if the sdk is actually authenticated. Also provides buttons to allow the user to authenticate the SDK when its needed.
const SpotifyWebSDKProvider = ({ children, autoAuthenticate }: { children: ReactNode; autoAuthenticate?: boolean }) => {
    const { clientSDK, isAuthenticated, connectSDK } = useSpotifyWebSDK()
    const navigate = useNavigate()
    const path = useLocation()

    // TODO : will brake if the redirect path used by the SDK is changed
    const pathForSpotifyRedirect = "/settings/spotify"
    const isOnEnablePage = path && path.pathname == pathForSpotifyRedirect

    // This is here instead of the hook to control where and when auto connect happens
    useEffect(() => {
        if (!autoAuthenticate) return

        // Spotify auth redirect provides a token that the spotify api library can consume and set things up, but it needs a call for that
        // So this useEffect checks for it and calls the auth function
        const pageHasAuthTokenCode = path.search.startsWith("?code=")

        // No de-duping calls, should be fine since the library only makes a redirect to Spotify if it has to, and since at this point
        // it will have the auth token it won't redirect
        const autoConnect = async () => {
            if (pageHasAuthTokenCode && !isAuthenticated) {
                await connectSDK()

                // This is used to flush the search params, the auth code from Spotify, from useLocation after auto connect.
                // The library consumes the code in connectSDK, but useLocation still has state with the code, but I think the library
                // takes it directly from the url.
                // This is needed to prevent this firing unnecessarily and the log-out issue where logging out triggered this function
                // because the SDK was no longer authenticated and useLocation still thought it had the code in the url.
                navigate(pathForSpotifyRedirect)
            }
        }

        autoConnect()
    }, [connectSDK, isAuthenticated, path, autoAuthenticate, navigate])

    if (isAuthenticated === undefined) return <LoadingMessage />

    if (isAuthenticated === false && !isOnEnablePage) {
        return (
            <Button
                type="button"
                onClick={() => navigate("/settings/spotify")}
                className={"flex items-center gap-2 w-full"}
                variant={"secondary"}
            >
                <Icons.spotify className={"size-4"} /> Go to settings
            </Button>
        )
    } else if (isAuthenticated === false && isOnEnablePage) {
        return (
            <Button type="button" onClick={connectSDK} className={"flex items-center gap-2 w-full"} variant={"secondary"}>
                <Icons.spotify className={"size-4"} /> Connect
            </Button>
        )
    }

    if (!clientSDK) {
        return (
            <div className={"text-xs text-muted-foreground"}>
                SpotifyWebSDK is missing. <br /> Something went wrong.
            </div>
        )
    }

    return <SpotifyWebSDKContext.Provider value={clientSDK}>{children}</SpotifyWebSDKContext.Provider>
}

export default SpotifyWebSDKProvider

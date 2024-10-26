import {
    AuthorizationCodeWithPKCEStrategy,
    Scopes,
    SpotifyApi,
} from "@spotify/web-api-ts-sdk";
import { useEffect, useState } from "react";
import { useSpotifyStore } from "./spotify-store";

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;
const redirectUrl = import.meta.env.VITE_SPOTIFY_REDIRECT_URL as string;
const scopes = Scopes.all;
// const apiSDKConfig  = SdkOptions

// TODO : it might redirect the user to spotify auth, not sure yet, will have to test for longer
export const useSpotify = ({ enabled = false }: { enabled?: boolean }) => {
    const apiSDK = useSpotifyStore.use.apiSDK();
    const setApiSDK = useSpotifyStore.use.setApiSDK();

    const authenticate = async () => {
        if (apiSDK) return;

        const auth = new AuthorizationCodeWithPKCEStrategy(
            clientId,
            redirectUrl,
            scopes
        );

        const internalSdk = new SpotifyApi(auth, {});

        try {
            if (enabled) {
                const { authenticated } = await internalSdk.authenticate();

                if (authenticated) {
                    console.log("Successfully set Spotify Web SDK");
                    setApiSDK(internalSdk);
                }
            }
        } catch (e: Error | unknown) {
            const error = e as Error;
            if (
                error &&
                error.message &&
                error.message.includes("No verifier found in cache")
            ) {
                console.error(
                    "If you are seeing this error in a React Development Environment it's because React calls useEffect twice. Using the Spotify SDK performs a token exchange that is only valid once, so React re-rendering this component will result in a second, failed authentication. This will not impact your production applications (or anything running outside of Strict Mode - which is designed for debugging components).",
                    error
                );
            } else {
                console.error(e);
            }
        }
    };

    const logout = () => {
        apiSDK?.logOut();
        setApiSDK(null);
    };

    useEffect(() => {
        if (enabled) authenticate();
    }, [clientId, redirectUrl, scopes, enabled]);

    return {
        apiSDK,
        logout,
        authenticate,
        isReady: !!apiSDK,
    };
};

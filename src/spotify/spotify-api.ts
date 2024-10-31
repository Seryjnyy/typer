import { useQuery } from "@tanstack/react-query";
import { useSpotify } from "./use-spotify";
import { useSpotifyStore } from "./spotify-store";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";

// TODO : might have to use provider or something, to make sure that the apiSDK is set
const useSpotifyData = <T, Keys extends unknown[]>(
    name: string,
    keys: Keys,
    fetcher: (client: SpotifyApi, ...keys: [...Keys]) => Promise<T>
) => {
    const getAccessToken = useSpotifyStore.use.getAccessToken();
    const getApiSDKOrThrow = useSpotifyStore.use.getApiSDKOrThrow();
    // TODO : this will throw error when spotify client doesn't exist, idk how to deal with that yet
    const apiSDK = getApiSDKOrThrow();

    return useQuery<T>({
        queryKey: [name, getAccessToken(), keys],
        queryFn: () => fetcher(apiSDK, ...keys),
    });
};

export const useAvailableDevices = () => {
    return useSpotifyData("MyDevices", [], (client) =>
        client.player.getAvailableDevices()
    );
};

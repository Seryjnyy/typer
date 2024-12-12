import { useQuery } from "@tanstack/react-query"
import { SpotifyApi } from "@spotify/web-api-ts-sdk"
import { useSpotifyAccessTokenContext } from "@/components/spotify-new/providers/spotify-access-token-provider.tsx"
import { useSpotifyWebSDKContext } from "@/components/spotify-new/providers/spotify-web-sdk-provider.tsx"

const useSpotifyData = <T, Keys extends unknown[]>(
    name: string,
    keys: Keys,
    fetcher: (client: SpotifyApi, ...keys: [...Keys]) => Promise<T>
) => {
    const accessToken = useSpotifyAccessTokenContext()
    const webSDK = useSpotifyWebSDKContext()

    return useQuery<T>({
        queryKey: [name, accessToken.access_token, keys],
        queryFn: () => fetcher(webSDK, ...keys),
    })
}

export const useAvailableDevices = () => {
    return useSpotifyData("MyDevices", [], (client) => client.player.getAvailableDevices())
}

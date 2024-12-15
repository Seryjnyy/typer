import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import SpotifyFeatureGuard from "@/components/spotify/spotify-feature-guard.tsx"
import SpotifyWebSDKProvider from "@/components/spotify/providers/spotify-web-sdk-provider.tsx"
import SpotifyPlayerFeatureGuard from "@/components/spotify/spotify-player-feature-guard.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Icons } from "@/components/icons"
import { useSpotifyWebSDK } from "@/components/spotify/use-spotify-web-sdk.ts"

export default function Spotify() {
    const { disconnectSDK } = useSpotifyWebSDK()
    return (
        <div className="space-y-12">
            <h2 className="text-2xl font-semibold pb-2">Spotify</h2>
            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Spotify integration</CardTitle>
                        <CardDescription>
                            Enable Spotify and connect it to this app. Enables you to search for songs through Spotify and play music.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-6 flex-col">
                            <SpotifyFeatureGuard returnDisable={true}>
                                <div className={"space-y-4"}>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Spotify authentication</CardTitle>
                                            <CardDescription>Authenticate yourself, or log out.</CardDescription>
                                        </CardHeader>
                                        <CardContent className={"w-full "}>
                                            <SpotifyFeatureGuard>
                                                <SpotifyWebSDKProvider autoAuthenticate={true}>
                                                    <div className={"flex flex-col gap-3 items-center"}>
                                                        <span className={"font-semibold"}>You're good to go!</span>
                                                        <Button
                                                            type={"button"}
                                                            variant={"secondary"}
                                                            className={"flex items-center gap-2 w-full"}
                                                            onClick={() => {
                                                                disconnectSDK()
                                                                console.log("logged out")
                                                            }}
                                                        >
                                                            <Icons.spotify className={"size-4"} /> Log out
                                                        </Button>
                                                    </div>
                                                </SpotifyWebSDKProvider>
                                            </SpotifyFeatureGuard>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Spotify player</CardTitle>
                                            <CardDescription>Spotify Premium is required for this feature.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <SpotifyFeatureGuard>
                                                <SpotifyPlayerFeatureGuard returnDisable={true}>
                                                    <></>
                                                </SpotifyPlayerFeatureGuard>
                                            </SpotifyFeatureGuard>
                                        </CardContent>
                                    </Card>
                                </div>
                            </SpotifyFeatureGuard>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

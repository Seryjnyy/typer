import SpotifyFeatureGuard from "@/components/spotify-new/spotify-feature-guard.tsx"
import SpotifyPlayer from "@/components/spotify-new/player/spotify-player.tsx"
import { Rnd } from "react-rnd"
import { useIsSpotifyPlayerEnabled, useIsSpotifyPlayerOpen } from "@/components/spotify-new/player/spotify-player-state.ts"

export default function FloatingSpotifyPlayer() {
    const [open] = useIsSpotifyPlayerOpen()
    const [isSpotifyPlayerEnabled] = useIsSpotifyPlayerEnabled()

    if (!isSpotifyPlayerEnabled) return null

    return (
        <Rnd
            className={"z-[100] backdrop-blur-sm flex items-center justify-center outline-1 outline rounded-lg "}
            default={{
                x: 16,
                y: 16,
                width: 768,
                height: 200,
            }}
            size={
                open
                    ? {
                          width: 768,
                          height: 200,
                      }
                    : {
                          width: 200,
                          height: 60,
                      }
            }
            bounds={"parent"}
            enableResizing={false}
        >
            <div className={"    rounded-lg  flex  p-3  w-full h-full  "}>
                <SpotifyFeatureGuard>
                    <SpotifyPlayer />
                </SpotifyFeatureGuard>
            </div>
        </Rnd>
    )
}

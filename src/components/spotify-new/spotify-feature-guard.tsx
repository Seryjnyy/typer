import { Button } from "@/components/ui/button.tsx"
import { atomWithStorage } from "jotai/utils"
import { useAtom } from "jotai/index"
import { ReactNode } from "react"
import { Icons } from "@/components/icons.tsx"

// TODO : move this out
const isUseSpotify = atomWithStorage("typer:is-use-spotify", false)
const useSpotifySetting = () => useAtom(isUseSpotify)

// TODO :I'm not sure if this component is needed anymore, I added this because Spotify did auto redirect because it was set up to
// authenticate
// in useEffect. But its manual now so idk.
function SpotifyFeatureGuard({ children }: { children: ReactNode }) {
    const [isWantToUseSpotify, setIsWantToUseSpotify] = useSpotifySetting()

    if (!isWantToUseSpotify)
        return (
            <div>
                <Button
                    type={"button"}
                    onClick={() => setIsWantToUseSpotify(true)}
                    variant={"secondary"}
                    className={"flex items-center" + " gap-2"}
                >
                    <Icons.spotify className={"size-4"} /> Turn on Spotify
                </Button>
            </div>
        )

    return children
}

export default SpotifyFeatureGuard

import { atomWithStorage } from "jotai/utils"
import { useAtom } from "jotai/index"

const isSpotifyEnabled = atomWithStorage("typer:is-use-spotify", false)
export const useIsSpotifyEnabled = () => useAtom(isSpotifyEnabled)

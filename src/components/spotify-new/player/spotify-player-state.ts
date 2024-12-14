import { atom, useAtom } from "jotai/index"
import { atomWithStorage } from "jotai/utils"

const spotifyPlayerOpenAtom = atom(false)
export const useIsSpotifyPlayerOpen = () => useAtom(spotifyPlayerOpenAtom)

const spotifyPlayerEnabled = atomWithStorage("typer:is-spotify-player-enabled", false)
export const useIsSpotifyPlayerEnabled = () => useAtom(spotifyPlayerEnabled)

import { atom, useAtom } from "jotai/index"

const spotifyPlayerOpenAtom = atom(false)
export const useIsSpotifyPlayerOpen = () => useAtom(spotifyPlayerOpenAtom)

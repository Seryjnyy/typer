import { atom, useAtom } from "jotai"

const songProgress = atom(0)
export const useSongProgress = () => useAtom(songProgress)

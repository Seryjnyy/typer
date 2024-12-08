import { useQueueStore } from "@/lib/store/queue-store.tsx"
import { useSong } from "@/lib/hooks/use-song.tsx"

export const useCurrentSong = () => {
    const currentSongInQueue = useQueueStore.use.current()
    return useSong(currentSongInQueue ?? "")
}

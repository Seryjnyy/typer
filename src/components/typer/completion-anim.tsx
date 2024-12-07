import { useSongCover } from "@/lib/hooks/use-song-cover"
import { usePreferenceStore } from "@/lib/store/preferences-store"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { Song } from "@/lib/types.ts"

// TODO : Dupliacte code with correct and error animations
export function CompletionAnim({ song, index }: { song: Song; index: number }) {
    const [animationKey, setAnimationKey] = useState(0)
    const isCompletionAnimOn = usePreferenceStore.use.isCompletionAnim()
    const { coverAsAvatarStyle } = useSongCover(song)

    useEffect(() => {
        if (index != undefined) {
            triggerAnimation()
        }
    }, [index])

    const triggerAnimation = () => {
        setAnimationKey((prevKey) => prevKey + 1)
    }

    if (!isCompletionAnimOn || animationKey === 0) return null

    return (
        <div
            key={animationKey}
            className={cn("absolute bottom-0 left-0 brightness-50", {
                "w-full h-full  animate-explosion": animationKey != 0,
            })}
            style={coverAsAvatarStyle}
        ></div>
    )
}

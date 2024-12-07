import { usePreferenceStore } from "@/lib/store/preferences-store"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { Song } from "@/lib/types.ts"
import { useSongCover } from "@/lib/hooks/use-song-cover.ts"

export default function CorrectAnim({ index, song }: { index: number | null; song: Song }) {
    const [animationKey, setAnimationKey] = useState(0)
    const isCorrectAnim = usePreferenceStore.use.isCorrectAnim()
    const { coverAsBgGradientStyle } = useSongCover(song)

    useEffect(() => {
        if (index != 0) {
            triggerAnimation()
        }
    }, [index])

    const triggerAnimation = () => {
        setAnimationKey((prevKey) => prevKey + 1)
    }

    if (!isCorrectAnim || animationKey === 0) return null

    return (
        <div
            key={animationKey}
            style={{ ...coverAsBgGradientStyle, padding: Math.random() * 100 + "px" }}
            className={cn(`absolute  rounded-full  sm:-bottom-5 bottom-10 right-0 sm:-right-5 brightness-50   `, {
                "animate-explosion w-[6vw] h-[6vw]   duration-300": animationKey > 0,
            })}
        ></div>
    )
}

import { usePreferenceStore } from "@/lib/store/preferences-store"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { X } from "lucide-react"

// TODO : duplicate code with correct anim, but keeping it this way in case we want diff animations
export default function ErrorAnim({ index }: { index: number | null }) {
    const [animationKey, setAnimationKey] = useState(0)
    const isErrorAnim = usePreferenceStore.use.isErrorAnim()

    useEffect(() => {
        if (index != 0) {
            triggerAnimation()
        }
    }, [index])

    const triggerAnimation = () => {
        setAnimationKey((prevKey) => prevKey + 1)
    }

    if (!isErrorAnim || animationKey === 0) return null

    return (
        <div
            key={animationKey}
            className={cn(`absolute  bg-gradient-to-tr from-red-500 rounded-full  sm:-bottom-5 bottom-10 left-0 sm:-left-5    `, {
                "animate-explosion w-[10vw] h-[10vw] duration-300": animationKey !== 0,
            })}
        >
            <X className={"size-[10vw] absolute bottom-0 left-0 text-red-500"} />
        </div>
    )
}

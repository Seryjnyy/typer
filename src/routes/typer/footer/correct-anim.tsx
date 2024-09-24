import { usePreferenceStore } from "@/lib/store/preferences-store";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function CorrectAnim({ index }: { index: number | null }) {
    const [animationKey, setAnimationKey] = useState(0);
    const isErrorAnim = usePreferenceStore.use.isErrorAnim();

    useEffect(() => {
        if (index != undefined) {
            triggerAnimation();
        }
    }, [index]);

    const triggerAnimation = () => {
        setAnimationKey((prevKey) => prevKey + 1);
    };

    if (!isErrorAnim) return null;

    return (
        <div
            key={animationKey}
            className={cn(
                `absolute  bg-gradient-to-tl from-green-500 rounded-full  sm:-bottom-5 bottom-10 right-0 sm:-right-5 brightness-50   `,
                {
                    "animate-explosion w-[10vw] h-[10vw] duration-300":
                        animationKey != 0,
                }
            )}
        ></div>
    );
}

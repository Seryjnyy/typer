import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function ErrorAnim({
    errorIndex,
}: {
    errorIndex: number | null;
}) {
    const [animationKey, setAnimationKey] = useState(0);

    useEffect(() => {
        if (errorIndex != undefined) {
            triggerAnimation();
        }
    }, [errorIndex]);

    const triggerAnimation = () => {
        setAnimationKey((prevKey) => prevKey + 1);
    };

    return (
        <div
            key={animationKey}
            className={cn(
                `absolute  bg-gradient-to-tr from-red-500 rounded-full  -bottom-5 -left-5   `,
                {
                    "animate-explosion w-[10vw] h-[10vw] duration-300":
                        animationKey != 0,
                }
            )}
        ></div>
    );
}

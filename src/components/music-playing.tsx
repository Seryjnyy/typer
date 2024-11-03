import { cn } from "@/lib/utils";

import { cva, VariantProps } from "class-variance-authority";
import { CSSProperties } from "react";

const musicPlayingVariants = cva(
    "relative flex justify-between w-[13px] h-[13px]",
    {
        variants: {
            variant: {
                primary: "[&>span]:bg-primary ",
                accent: "[&>span]:bg-accent",
            },
        },
        defaultVariants: {
            variant: "accent",
        },
    }
);
interface MusicPlayingProps extends VariantProps<typeof musicPlayingVariants> {
    className?: string;
    style?: CSSProperties;
}

// https://samuelkraft.com/blog/animated-music-bars
export default function MusicPlaying({
    className,
    style,
    variant,
}: MusicPlayingProps) {
    return (
        <div
            className={cn(musicPlayingVariants({ variant, className }))}
            style={style}
        >
            <span className="w-[3px] h-[100%] rounded-[3px] origin-center animate-musicPlaying delay-300" />
            <span className="w-[3px] h-[100%] rounded-[3px] origin-center animate-musicPlaying" />
            <span className="w-[3px] h-[100%] rounded-[3px] origin-center animate-musicPlaying delay-200" />
        </div>
    );
}

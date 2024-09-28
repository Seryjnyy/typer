import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";
import PlayButton from "../play-button";
import { Song } from "@/lib/types";
import { cva, type VariantProps } from "class-variance-authority";

const songBannerVariants = cva("", {
    variants: {
        size: {
            default: "min-h-12 min-w-12 max-h-12 max-w-12",
            small: "min-h-4 min-w-4 max-h-4 max-w-4",
            large: "min-h-[6rem] min-w-[6rem] max-h-[6rem] max-w-[6rem]",
            extraLarge:
                "min-h-[10rem] min-w-[10rem] max-h-[10rem] max-w-[10rem]",
        },
    },
    defaultVariants: {
        size: "default",
    },
});

interface SongBannerProps
    extends React.ButtonHTMLAttributes<HTMLDivElement>,
        VariantProps<typeof songBannerVariants> {
    song: Song;
    className?: string;
    playButton?: boolean;
}

const SongBanner = ({
    song,
    className,
    size,
    playButton = false,
    ...props
}: SongBannerProps) => {
    return (
        <div
            className={cn(
                songBannerVariants({ size: size }),
                song.cover,
                "rounded-md flex justify-center items-center relative overflow-hidden",
                className
                // "bg-gradient-to-bl from-yellow-200 to-violet-800"
            )}
            {...props}
        >
            {playButton && (
                <div className="z-40 peer">
                    <PlayButton songID={song.id} />
                </div>
            )}
            {playButton && (
                <div className="w-full h-full hover:backdrop-brightness-75 absolute  z-20 peer-hover:backdrop-brightness-75"></div>
            )}
        </div>
    );
};

const songDetailVariants = cva(
    "text-ellipsis overflow-hidden whitespace-nowrap",
    {
        variants: {
            length: {
                default: "max-w-[4.7rem]    ",
                long: "max-w-[8rem] ",
                "extra-long": "max-w-[10rem] ",
                full: "w-full",
            },
        },
        defaultVariants: {
            length: "default",
        },
    }
);

interface SongDetailProps
    extends React.ButtonHTMLAttributes<HTMLDivElement>,
        VariantProps<typeof songDetailVariants> {
    song: Song;
    isCurrent?: boolean;
    className?: string;
}

const SongDetail = ({
    song,
    isCurrent = false,
    className,
    length,
    ...props
}: SongDetailProps) => {
    return (
        <div
            className={cn(
                "flex flex-col leading-tight justify-center ",
                className
            )}
            {...props}
        >
            <span
                className={cn(
                    songDetailVariants({ length }),
                    isCurrent ? "text-secondary-foreground" : "text-foreground"
                )}
            >
                {song.title}
            </span>
            <span
                className={cn(
                    "text-muted-foreground text-sm",
                    songDetailVariants({ length })
                )}
            >
                {song.source}
            </span>
        </div>
    );
};

const SongHeader = ({
    className,
    children,
}: {
    className?: string;
    children?: ReactNode;
}) => {
    return (
        <div className={cn("w-full", className)}>
            <div className="flex gap-2">{children}</div>
        </div>
    );
};

export { SongHeader, SongBanner, SongDetail };

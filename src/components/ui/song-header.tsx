import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";
import PlayButton from "../play-button";
import { Song } from "@/lib/types";
import { cva, type VariantProps } from "class-variance-authority";

const SongBanner = ({
    song,
    className,
    playButton,
}: {
    song: Song;
    className?: string;
    playButton?: boolean;
}) => {
    return (
        <div
            className={cn(
                "h-12 w-12 rounded-md flex justify-center items-center",
                className,
                song.cover
                // "bg-gradient-to-bl from-yellow-200 to-violet-800"
            )}
        >
            {playButton && <PlayButton songID={song.id} />}
        </div>
    );
};

const songDetailVariants = cva(
    "text-ellipsis overflow-hidden whitespace-nowrap",
    {
        variants: {
            length: {
                default: "max-w-[4.2rem] ",
                long: "max-w-[8rem] ",
                "extra-long": "max-w-[10rem] ",
            },
        },
        defaultVariants: {
            length: "default",
        },
    }
);

interface SongDetailProps extends VariantProps<typeof songDetailVariants> {
    song: Song;
    isCurrent: boolean;
    className?: string;
}

const SongDetail = ({
    song,
    isCurrent,
    className,
    length,
}: SongDetailProps) => {
    return (
        <div
            className={cn(
                "flex flex-col leading-tight justify-center ",
                className
            )}
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

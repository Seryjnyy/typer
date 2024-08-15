import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";
import PlayButton from "../play-button";
import { Song } from "@/lib/types";
import { cva, type VariantProps } from "class-variance-authority";

const SongBanner = ({
    song,
    className,
}: {
    song: Song;
    className?: string;
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
            <PlayButton songID={song.id} />
        </div>
    );
};

const songDetailVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            length: {
                default: "max-w-[4rem]",
                long: "max-w-[8rem]",
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

const SongDetail = ({ song, isCurrent, className }: SongDetailProps) => {
    return (
        <div
            className={cn(
                "flex flex-col leading-tight justify-center",
                className
            )}
        >
            <span
                className={cn(
                    "text-ellipsis overflow-hidden max-w-[4rem]",
                    isCurrent ? "text-accent" : ""
                )}
            >
                {(
                    song.title +
                    "fdsonfdsijfdisfnidosnfoinio fsdfdsfds fdsfsdf fdsfds"
                ).substring(0, 14)}
            </span>
            <span className="text-muted-foreground text-sm">{song.source}</span>
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

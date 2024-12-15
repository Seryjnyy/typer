import { useSongCover } from "@/lib/hooks/use-song-cover"
import { Song } from "@/lib/types"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import React, { ReactNode } from "react"
import PlayButton from "../play-button"
import { Icons } from "@/components/icons.tsx"

const songBannerVariants = cva("rounded-md flex justify-center items-center relative overflow-hidden", {
    variants: {
        size: {
            xs: "min-h-4 min-w-4 max-h-4 max-w-4",
            sm: "min-h-8 min-w-8 max-h-8 max-w-8",
            md: "min-h-12 min-w-12 max-h-12 max-w-12",
            lg: "min-h-[6rem] min-w-[6rem] max-h-[6rem] max-w-[6rem]",
            xl: "min-h-[10rem] min-w-[10rem] max-h-[10rem] max-w-[10rem]",
        },
    },
    defaultVariants: {
        size: "md",
    },
})

interface SongBannerProps extends React.ButtonHTMLAttributes<HTMLDivElement>, VariantProps<typeof songBannerVariants> {
    song: Song
    className?: string
    playButton?: boolean
}

const SongBanner = ({ song, className, size, playButton = false, ...props }: SongBannerProps) => {
    const { coverAsAvatarStyle } = useSongCover(song)

    return (
        <div className={cn(songBannerVariants({ size, className }))} {...props} style={coverAsAvatarStyle}>
            {playButton && (
                <div className="z-40 peer">
                    <PlayButton songID={song.id} />
                </div>
            )}
            {playButton && (
                <div className="w-full h-full hover:backdrop-brightness-75 absolute  z-20 peer-hover:backdrop-brightness-75 rounded-md"></div>
            )}
        </div>
    )
}

const songDetailVariants = cva("text-ellipsis overflow-hidden whitespace-nowrap", {
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
})

interface SongDetailProps extends React.ButtonHTMLAttributes<HTMLDivElement>, VariantProps<typeof songDetailVariants> {
    song: Song
    isCurrent?: boolean
    className?: string
}

const SongDetail = ({ song, isCurrent = false, className, length, ...props }: SongDetailProps) => {
    return (
        <div className={cn("flex flex-col leading-tight justify-center ", className)} {...props}>
            <span className={cn(songDetailVariants({ length }), isCurrent ? "text-secondary-foreground" : "text-foreground")}>
                {song.title}
            </span>
            <span
                className={cn(
                    "text-muted-foreground text-sm  flex items-center gap-1 justify-start overflow-hidden ",
                    songDetailVariants({ length })
                )}
            >
                {song.spotifyUri && <Icons.spotify className={"size-[0.9rem] min-w-[0.9rem] min-h-[0.9rem] fill-white "} />}
                <span> {song.source}</span>
            </span>
        </div>
    )
}

const SongHeader = ({ className, children }: { className?: string; children?: ReactNode }) => {
    return (
        <div className={cn("w-full", className)}>
            <div className="flex gap-2">{children}</div>
        </div>
    )
}

export { SongBanner, SongDetail, SongHeader }

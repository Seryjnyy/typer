import React from "react"
import { Button, ButtonProps } from "./ui/button"
import { PlayIcon } from "@radix-ui/react-icons"
import { useQueueStore } from "@/lib/store/queue-store"
import MusicPlaying from "./music-playing"
import usePlaySong from "@/lib/hooks/use-play-song"
import { cn } from "@/lib/utils.ts"

export default function PlayButton({
    songID,
    variant = "ghost",
    size = "icon",
    children,
    onClick,
    className,
    redirect,
    ...props
}: { songID: string; redirect?: boolean } & ButtonProps) {
    const playSong = usePlaySong()
    const current = useQueueStore.use.current()

    const onPlay = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()

        playSong(songID, redirect)
    }

    return (
        <Button
            onClick={(e) => {
                onPlay(e)
                onClick?.(e)
            }}
            size={size}
            className={cn("rounded-full hover:bg-background hover:text-foreground flex gap-2 items-center", className)}
            variant={variant}
            {...props}
        >
            {current == songID && <MusicPlaying />}
            {current != songID && <PlayIcon className="w-5 h-5" />}
            {children}
        </Button>
    )
}

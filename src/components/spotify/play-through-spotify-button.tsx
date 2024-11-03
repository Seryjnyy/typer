import { Song } from "@/lib/types";
import { Icons } from "../icons";
import { Button, ButtonProps } from "../ui/button";
import MusicPlaying from "../music-playing";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { usePlaySongThroughSpotify } from "./use-play-song-through-spotify";

type PlayThroughSpotifyButtonProps = {
    song: Song;
} & Omit<ButtonProps, "children">;

const PlayThroughSpotifyButton = forwardRef<
    HTMLButtonElement,
    PlayThroughSpotifyButtonProps
>(({ song, variant, size, className, ...props }, ref) => {
    const { setPlayableSong, currentPlayableSong } =
        usePlaySongThroughSpotify();

    if (song.spotifyUri == null) return null;

    const handleClick = () => {
        setPlayableSong(song);
    };

    const isCurrentlyPlaying = currentPlayableSong?.id === song.id;

    return (
        <Button
            ref={ref}
            variant={variant}
            size={size}
            className={cn("flex items-center gap-2", className)}
            onClick={handleClick}
            {...props}
        >
            <Icons.spotify className="size-4 fill-primary-foreground " /> Play
            {isCurrentlyPlaying && <MusicPlaying variant={"primary"} />}
        </Button>
    );
});

PlayThroughSpotifyButton.displayName = "PlayThroughSpotifyButton";

export default PlayThroughSpotifyButton;

import { Song } from "@/lib/types";
import { usePlayableSongStore } from "@/spotify/player/playable-song-store";
import { Icons } from "../icons";
import { Button, ButtonProps } from "../ui/button";
import MusicPlaying from "../music-playing";
import { cn } from "@/lib/utils";

type PlayThroughSpotifyButtonProps = {
    song: Song;
} & Omit<ButtonProps, "children">;

export default function PlayThroughSpotifyButton({
    song,
    variant,
    size,
    className,
    ...props
}: PlayThroughSpotifyButtonProps) {
    const setPlayableSong = usePlayableSongStore.use.setPlayableSong();
    const playableSong = usePlayableSongStore.use.playableSong();

    if (song.spotifyUri == null) return null;

    const handleClick = () => {
        setPlayableSong(song);
    };

    const isCurrentlyPlaying = playableSong?.id === song.id;
    /* TODO : only show if web player is enabled, only if its open. Or maybe allow then ask the user to enable it and open it  */
    return (
        <Button
            variant={variant}
            size={size}
            className={cn("flex items-center gap-2", className)}
            onClick={handleClick}
            // disabled={playableSong.id === song.id}
            {...props}
        >
            <Icons.spotify className="size-4 fill-primary-foreground " /> Play
            {isCurrentlyPlaying && <MusicPlaying variant={"primary"} />}
        </Button>
    );
}

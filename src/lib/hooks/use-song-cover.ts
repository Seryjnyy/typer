import { useMemo } from "react";
import { coverAsStyle, parseGeneratedCoverString } from "../gradient";
import { Song } from "../types";

// TODO : idk why im doing this, seems a bit stupid, but actually now I used it a bit it might be decent at least for now
export const useSongCover = (song: Song | null | undefined) => {
    const cover = useMemo(() => {
        if (!song) return null;
        return parseGeneratedCoverString(song.cover);
    }, [song]);

    const coverStyle = useMemo(() => {
        if (!cover) return {};
        return coverAsStyle(cover);
    }, [cover]);

    const coverAsBgGradientStyle: Pick<React.CSSProperties, "backgroundImage"> =
        useMemo(() => {
            return {
                backgroundImage: `linear-gradient(180deg, ${
                    cover?.colours[0] ?? "transparent"
                } 30%, transparent 70%)`,
            };
        }, [cover]);

    return {
        cover,
        coverAsBgGradientStyle,
        coverAsAvatarStyle: coverStyle,
    };
};

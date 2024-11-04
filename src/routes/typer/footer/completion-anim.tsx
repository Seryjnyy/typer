import { useSongCover } from "@/lib/hooks/use-song-cover";
import { usePreferenceStore } from "@/lib/store/preferences-store";
import { cn } from "@/lib/utils";
import { ProgressManager, SongData } from "../types";

interface CompletionAnimProps {
    songData?: SongData;
    progressManager: ProgressManager;
}

export default function CompletionAnim({
    songData,
    progressManager,
}: CompletionAnimProps) {
    const isCompletionAnimOn = usePreferenceStore.use.isCompletionAnim();
    const { coverAsAvatarStyle } = useSongCover(songData?.song);

    if (!isCompletionAnimOn) return null;

    return (
        <div
            className={cn("absolute bottom-0 left-0 brightness-50 rounded-lg", {
                "w-full h-full  animate-explosion": progressManager.completed,
            })}
            style={coverAsAvatarStyle}
        ></div>
    );
}

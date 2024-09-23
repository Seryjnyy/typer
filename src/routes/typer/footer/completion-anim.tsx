import { usePreferenceStore } from "@/lib/store/preferences-store";
import { cn } from "@/lib/utils";
import React from "react";
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

    if (!isCompletionAnimOn) return null;

    return (
        <div
            className={cn(
                "absolute bottom-0 left-0 brightness-50 rounded-lg",
                songData?.song.cover,
                {
                    "w-full h-full  animate-explosion":
                        progressManager.completed,
                }
            )}
        ></div>
    );
}

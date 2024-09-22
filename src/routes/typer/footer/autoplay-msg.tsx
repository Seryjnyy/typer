import React from "react";
import { ProgressManager } from "../types";
import { useQueueStore } from "@/lib/store/queue-store";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface AutoplayMsgProps {
    progressManager: ProgressManager;
}

export default function AutoplayMsg({ progressManager }: AutoplayMsgProps) {
    const isAutoplay = useQueueStore.use.autoplay();
    const getNextSong = useQueueStore.use.getNextSong();

    if (!isAutoplay || progressManager.completed) return null;

    return (
        <div
            className={cn(
                "absolute flex text-xs opacity-0 text-muted-foreground items-center gap-2 bottom-6 left-[50%] -translate-x-[50%] translate-y-[75%]  px-2 backdrop-blur-xl  rounded-sm py-0 ",
                {
                    "animate-playingNextSong": progressManager.completed,
                }
            )}
        >
            {getNextSong() ? (
                <>
                    <span>Playing next song</span>
                    <Loader2 className="animate-spin size-3" />
                </>
            ) : (
                <span>End of queue</span>
            )}
        </div>
    );
}

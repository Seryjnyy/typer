import { TrackNextIcon, TrackPreviousIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { useQueueStore } from "../lib/store/queue-store";
import { ReactNode } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function QueueControl({ children }: { children?: ReactNode }) {
    const playNext = useQueueStore.use.next();
    const playPrev = useQueueStore.use.prev();
    const getNextSong = useQueueStore.use.getNextSong();
    const getPrevSong = useQueueStore.use.getPrevSong();

    return (
        <div className="space-x-1 flex items-center">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        onClick={playPrev}
                        size={"icon"}
                        variant={"secondary"}
                        className="rounded-full"
                        disabled={getPrevSong() == null}
                    >
                        <TrackPreviousIcon />
                    </Button>
                </TooltipTrigger>

                <TooltipContent>
                    <p>Prev song</p>
                </TooltipContent>
            </Tooltip>
            {children}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        onClick={playNext}
                        size={"icon"}
                        variant={"secondary"}
                        className="rounded-full"
                        disabled={getNextSong() == null}
                    >
                        <TrackNextIcon />
                    </Button>
                </TooltipTrigger>

                <TooltipContent>
                    <p>Next song</p>
                </TooltipContent>
            </Tooltip>
        </div>
    );
}

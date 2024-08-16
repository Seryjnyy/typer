import { TrackNextIcon, TrackPreviousIcon } from "@radix-ui/react-icons";
import { Button } from "./components/ui/button";
import { useQueueStore } from "./lib/store/queue-store";
import { ReactNode } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function QueueControl({ children }: { children?: ReactNode }) {
    const playNext = useQueueStore.use.next();
    const playPrev = useQueueStore.use.prev();

    return (
        <div className="space-x-1">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        onClick={playPrev}
                        size={"icon"}
                        variant={"outline"}
                        className="rounded-full"
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
                        variant={"outline"}
                        className="rounded-full"
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

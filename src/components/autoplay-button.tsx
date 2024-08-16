import React from "react";
import { Button } from "./ui/button";
import { PauseIcon, PlayIcon } from "@radix-ui/react-icons";
import { useQueueStore } from "@/lib/store/queue-store";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AutoplayButton() {
    const autoplay = useQueueStore.use.autoplay();
    const setAutoplay = useQueueStore.use.setAutoplay();

    const onSwitchAutoplay = () => {
        setAutoplay(!autoplay);
    };

    return (
        <Button variant={"ghost"} onClick={onSwitchAutoplay} size={"sm"}>
            {/* <div className=" flex gap-2  rounded-md">
<div className="bg-card p-1 rounded-lg">
<PauseIcon className="text-card-foreground" />
</div>
<div className="bg-card p-1 rounded-lg border">
<PlayIcon className="text-card-foreground  " />
</div>
</div> */}
            {/* <span className="text-xs">
                    {queue.autoplay ? "auto" : "manual"}
                    </span> */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex items-center gap-2">
                        <div className="flex border rounded-md">
                            <div
                                className={cn("rounded-md", {
                                    invisible: autoplay,
                                })}
                            >
                                <PauseIcon />
                            </div>
                            <div
                                className={cn("rounded-md", {
                                    invisible: !autoplay,
                                })}
                            >
                                <PlayIcon />
                            </div>
                        </div>
                    </div>
                </TooltipTrigger>

                <TooltipContent>
                    <p>toggle autoplay</p>
                </TooltipContent>
            </Tooltip>
        </Button>
    );
}

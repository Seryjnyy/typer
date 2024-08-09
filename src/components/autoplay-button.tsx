import React from "react";
import { Button } from "./ui/button";
import { PauseIcon, PlayIcon } from "@radix-ui/react-icons";
import { useQueueStore } from "@/lib/store/queue-store";
import { cn } from "@/lib/utils";

export default function AutoplayButton() {
    const queue = useQueueStore();

    const onSwitchAutoplay = () => {
        queue.setAutoplay(!queue.autoplay);
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
            <div className="flex items-center gap-2">
                {/* <span className="text-xs">
                    {queue.autoplay ? "auto" : "manual"}
                </span> */}
                <div className="flex border rounded-md">
                    <div
                        className={cn("rounded-md", {
                            invisible: queue.autoplay,
                        })}
                    >
                        <PauseIcon />
                    </div>
                    <div
                        className={cn("rounded-md", {
                            invisible: !queue.autoplay,
                        })}
                    >
                        <PlayIcon />
                    </div>
                </div>
            </div>
        </Button>
    );
}

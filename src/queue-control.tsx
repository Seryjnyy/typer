import { TrackNextIcon, TrackPreviousIcon } from "@radix-ui/react-icons";
import { Button } from "./components/ui/button";
import { useQueueStore } from "./lib/store/queue-store";
import { ReactNode } from "react";

export default function QueueControl({ children }: { children?: ReactNode }) {
    const playNext = useQueueStore.use.next();
    const playPrev = useQueueStore.use.prev();

    return (
        <div className="space-x-2">
            <Button
                onClick={playPrev}
                size={"icon"}
                variant={"ghost"}
                className="rounded-full"
            >
                <TrackPreviousIcon />
            </Button>
            {children}
            <Button
                onClick={playNext}
                size={"icon"}
                variant={"ghost"}
                className="rounded-full"
            >
                <TrackNextIcon />
            </Button>
        </div>
    );
}

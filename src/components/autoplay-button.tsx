import { Button } from "./ui/button"
import { PauseIcon, PlayIcon } from "@radix-ui/react-icons"
import { useQueueStore } from "@/lib/store/queue-store"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export default function AutoplayButton() {
    const autoplay = useQueueStore.use.autoplay()
    const setAutoplay = useQueueStore.use.setAutoplay()

    const onSwitchAutoplay = () => {
        setAutoplay(!autoplay)
    }

    return (
        <Button variant={"ghost"} onClick={onSwitchAutoplay} size={"sm"}>
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
    )
}

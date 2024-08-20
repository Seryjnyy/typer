import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { LoopIcon } from "@radix-ui/react-icons";
import { Button, ButtonProps } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface LoopButtonProps extends ButtonProps {}

export default function LoopButton({ ...props }: LoopButtonProps) {
    const [loop, setLoop] = useState(0);

    const onLoop = () => {
        setLoop((prev) => (prev + 1 > 3 ? 0 : prev + 1));
    };

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant={"ghost"}
                    size={"icon"}
                    {...props}
                    onClick={onLoop}
                    className={cn("relative", props.className)}
                >
                    <LoopIcon />
                    {loop > 0 && (
                        <span className="absolute top-0 right-0 text-xs bg-primary rounded-full px-1">
                            {loop}
                        </span>
                    )}
                </Button>
            </TooltipTrigger>

            <TooltipContent>
                <p>Loop</p>
            </TooltipContent>
        </Tooltip>
    );
}

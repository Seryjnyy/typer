import { ProgressManager } from "../types";

import { cn, wpm } from "@/lib/utils";
import {
    CheckIcon,
    DividerVerticalIcon,
    KeyboardIcon,
} from "@radix-ui/react-icons";

interface SmallStatsProps {
    timeElapsed: number;
    userInputLength: number;
    focusedOnInput: boolean;
    completed: boolean;
    started: boolean;
}

export const SmallStats = ({
    timeElapsed,
    userInputLength,
    focusedOnInput,
    completed,
    started,
}: SmallStatsProps) => {
    return (
        <>
            <span>{timeElapsed}s</span>
            <span className="border-l pl-1">
                {timeElapsed > 0 ? wpm(userInputLength, timeElapsed) : 0}
                wpm
            </span>
            <span
                className={cn("border-l pl-1", {
                    "text-primary": focusedOnInput,
                })}
            >
                <KeyboardIcon />
            </span>

            <div className="pl-1 border-l">
                {!completed && started && (
                    <span className="animate-startUp transition-all ">
                        <DividerVerticalIcon className="size-3 animate-spin " />
                    </span>
                )}
                {completed && (
                    <span>
                        <CheckIcon className="size-3" />
                    </span>
                )}
            </div>
        </>
    );
};

interface StatsProps {
    focusedOnInput: boolean;
    progressManager: ProgressManager;
}

export default function Stats({ progressManager, focusedOnInput }: StatsProps) {
    return (
        <div className="absolute sm:bottom-2 bottom-14 left-2 text-xs text-muted-foreground flex items-center gap-1 z-0">
            <SmallStats
                timeElapsed={progressManager.timeElapsed}
                focusedOnInput={
                    progressManager.completed ? false : focusedOnInput
                }
                userInputLength={progressManager.userInput.length}
                completed={progressManager.completed}
                started={progressManager.started}
            />
        </div>
    );
}

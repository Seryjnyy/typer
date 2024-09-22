import React from "react";
import SmallStats from "../small-stats";
import { ProgressManager } from "../types";
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
            />
        </div>
    );
}

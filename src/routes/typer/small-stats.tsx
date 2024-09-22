import { cn, wpm } from "@/lib/utils";
import { CheckIcon, KeyboardIcon } from "@radix-ui/react-icons";
import React from "react";

interface SmallStatsProps {
    timeElapsed: number;
    userInputLength: number;
    focusedOnInput: boolean;
    completed: boolean;
}

export default function SmallStats({
    timeElapsed,
    userInputLength,
    focusedOnInput,
    completed,
}: SmallStatsProps) {
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
            {completed && (
                <span className="pl-1 border-l">
                    <CheckIcon />
                </span>
            )}
        </>
    );
}

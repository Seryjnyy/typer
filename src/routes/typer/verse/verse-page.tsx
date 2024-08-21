import React, { useMemo, useState } from "react";
import { useLocation } from "react-router";
import { convertSongToElements } from "./utils";
import Typing, { Handlers, ProgressManager, SongData } from "../typing";
import { cn } from "@/lib/utils";
import { useUiStateStore } from "@/lib/store/ui-state-store";
import { useStopwatch } from "react-timer-hook";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";

export default function VersePage() {
    const queueWindowOpen = useUiStateStore.use.queueWindowOpen();
    const { state } = useLocation();
    const { content } = state;

    const [userInput, setUserInput] = useState("");
    const [completed, setCompleted] = useState(false);
    const [correct, setCorrect] = useState(0);
    const [incorrect, setIncorrect] = useState(0);

    if (typeof content != "string") {
        throw Error("Verse in incorrect format.");
    }

    const songData: SongData = useMemo(() => {
        if (!content) return { song: "", songStripped: "" };

        return {
            song: content,
            songStripped: content.replace(/(\r\n|\n|\r)/gm, ""),
        };
    }, [content]);

    const {
        totalSeconds,
        start: startStopwatch,
        pause: pauseStopwatch,
        reset: resetStopwatch,
    } = useStopwatch({
        autoStart: false,
    });

    const restartProgressState = () => {
        setUserInput("");
        setCompleted(false);
        setCorrect(0);
        setIncorrect(0);
    };

    const progressManager: ProgressManager = {
        userInput: userInput,
        completed: completed,
        setCompleted: setCompleted,
        setCorrect: setCorrect,
        setIncorrect: setIncorrect,
        setUserInput: setUserInput,
        setTargetCharCount: () => {},
        setTypedCharCount: () => {},
        restartState: restartProgressState,
    };

    const handlers: Handlers = {
        onStart: () => {
            startStopwatch();
        },
        onFinish: () => {
            pauseStopwatch();
        },
    };

    const onRestart = () => {
        restartProgressState();
        resetStopwatch(undefined, false);
    };

    return (
        <div
            className={cn("h-full flex", queueWindowOpen ? "" : "pr-[15.5rem]")}
        >
            {/* <Stats>
        {
            <Button variant={"secondary"} onClick={onRestart}>
                reset song progress
            </Button>
        }
    </Stats> */}
            <div className="p-12">
                <Link to={"/"}>
                    <Button variant={"ghost"} className="space-x-2 group">
                        <ArrowLeftIcon className="group-hover:-translate-x-1 transition-transform" />{" "}
                        <span>Back</span>
                    </Button>
                </Link>
            </div>
            <Typing
                songData={songData}
                progressManager={progressManager}
                handlers={handlers}
            >
                {/* {!autoplay && completed && (
                    <EndScreen
                        onRestart={onRestart}
                        userInputLength={userInput.length}
                    />
                )} */}
            </Typing>
        </div>
    );
}

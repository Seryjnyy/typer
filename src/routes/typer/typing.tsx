import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { convertSongToElements } from "./utils";
import { useHotkeys } from "react-hotkeys-hook";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface SongData {
    full: string;
    stripped: string;
}

export interface ProgressManager {
    userInput: string;
    completed: boolean;
    setUserInput: (val: string) => void;
    setCompleted: (val: boolean) => void;
    setTypedCharCount: (val: number) => void;
    setTargetCharCount: (val: number) => void;
    setCorrect: (correct: number) => void;
    setIncorrect: (incorrect: number) => void;
    restartState: () => void;
}

export interface Handlers {
    onFinish?: () => void;
    onStart?: () => void;
    onChangeSong?: () => void;
    onClickVerse?: (verse: string) => void;
}

interface TypingProps {
    progressManager: ProgressManager;
    songData: SongData;
    handlers: Handlers;
    children?: ReactNode;
    tryVerseOption?: boolean;
}

export default function Typing({
    progressManager,
    songData,
    handlers,
    children,
    tryVerseOption,
}: TypingProps) {
    const [focusedOnInput, setFocusedOnInput] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const { element, startOfLineIndexes, startOfLineRefs, correct, incorrect } =
        useMemo(
            () =>
                convertSongToElements(
                    songData.full ?? "",
                    progressManager.userInput,
                    handlers.onClickVerse,
                    tryVerseOption
                ),
            [songData.full, progressManager.userInput]
        );

    const onUserInput = (input: string) => {
        if (songData.full == "") return;

        progressManager.setUserInput(input);

        const finished = input.length == songData.stripped.length;
        if (finished) {
            progressManager.setCompleted(true);
            handlers.onFinish?.();
        }

        progressManager.setTypedCharCount(input.length);

        // Check if user is on the start of a line, if so get the index
        const currentLineIndex = startOfLineIndexes.findIndex(
            (x) => x == progressManager.userInput.length
        );

        // Use the found index to index into parallel array to get the respective element and scroll to it
        // TODO : this currentLineIndex and startOfLineRefs separate variables seems smelly
        if (currentLineIndex != -1) {
            if (startOfLineRefs) {
                startOfLineRefs[currentLineIndex].scrollIntoView({
                    block: "center",
                });
                console.log("SCROLLING INTO VIEW");
            }
        }
    };

    useEffect(() => {
        handlers.onChangeSong?.();

        progressManager.setTargetCharCount(
            songData.stripped != undefined ? songData.stripped.length : 0
        );
    }, [songData.full]);

    useHotkeys("*", () => {
        // focus
        inputRef.current?.focus();

        if (songData.full != "" && !progressManager.completed) {
            inputRef.current?.focus();
            handlers.onStart?.();
        }
    });

    useEffect(() => {
        progressManager.setCorrect(correct);
        progressManager.setIncorrect(incorrect);
    }, [correct, incorrect]);

    // console.log("rerender");
    return (
        <div className="relative h-full w-full overflow-y-hidden  rounded-md">
            <ScrollArea className="h-full  relative ">
                <div className="w-full h-full ">
                    <div className="flex justify-start">
                        <div className="flex justify-center w-full py-24 relative">
                            <div
                                className="text-2xl font-semibold flex flex-col text-center"
                                // className={
                                //     queueWindowOpen ? "" : "pr-[15.5rem]"
                                // }
                            >
                                {songData.full != "" && element}
                            </div>

                            {children}

                            <textarea
                                value={progressManager.userInput}
                                onChange={(e) => onUserInput(e.target.value)}
                                placeholder="what"
                                className=" border opacity-0 fixed w-0 h-0  "
                                ref={inputRef}
                                disabled={progressManager.completed}
                                onFocus={() => setFocusedOnInput(true)}
                                onBlur={() => setFocusedOnInput(false)}
                            />
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}

import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { convertSongToElements } from "./utils";
import { useHotkeys } from "react-hotkeys-hook";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { KeyboardIcon, ReloadIcon } from "@radix-ui/react-icons";
import { cn, wpm } from "@/lib/utils";
import { Handlers, ProgressManager, SongData } from "./types";
import SmallStats from "./small-stats";
import TextModificationDialog from "./cylinder/text-modification-dialog";

interface FlatTyperProps {
    progressManager: ProgressManager;
    songData: SongData;
    handlers: Handlers;
    children?: ReactNode;
    tryVerseOption?: boolean;
}

export default function FlatTyper({
    progressManager,
    songData,
    handlers,
    children,
    tryVerseOption,
}: FlatTyperProps) {
    const [focusedOnInput, setFocusedOnInput] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const generatorResult = useMemo(
        () =>
            convertSongToElements(
                songData?.full ?? "",
                progressManager.userInput,
                handlers.onClickVerse,
                tryVerseOption
            ),
        [songData?.full, progressManager.userInput]
    );

    const { element, startOfLineIndexes, startOfLineRefs, correct, incorrect } =
        useMemo(() => generatorResult, [generatorResult]);

    useEffect(() => {
        if (generatorResult.errorIndex != null) {
            progressManager.recordError(generatorResult.errorIndex);
        }
    }, [generatorResult]);

    const onUserInput = (input: string) => {
        if (songData?.full == "") return;

        progressManager.setUserInput(input);

        const finished = input.length == songData?.stripped.length;
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
            songData?.stripped != undefined ? songData.stripped.length : 0
        );
    }, [songData?.full]);

    useHotkeys("*", (event) => {
        const { key } = event;
        const isLetter = /^[a-zA-Z]$/.test(key);
        const isNumber = /^[0-9]$/.test(key);
        const isPunctuation = /^[.,:;?!'"()\-_=+[\]{}<>/@#$%^&*~`]$/.test(key);

        // Only accept letters, numbers and punctuation
        // TODO : what happens with non standard characters, like from different alphabets?
        if (isLetter || isNumber || isPunctuation) {
            // focus
            inputRef.current?.focus();

            if (songData?.full != "" && !progressManager.completed) {
                inputRef.current?.focus();
                handlers.onStart?.();
            }
        }
    });

    useEffect(() => {
        progressManager.setCorrect(correct);
        progressManager.setIncorrect(incorrect);
    }, [correct, incorrect]);

    return (
        <div className="relative h-full w-full overflow-y-hidden  rounded-md ">
            <ScrollArea className="h-full  relative z-40">
                <div className="w-full h-full ">
                    <div className="flex justify-start">
                        <div className="flex justify-center w-full py-24 relative">
                            <div
                                className="text-2xl font-semibold flex flex-col text-center px-1 sm:px-2"
                                // className={
                                //     queueWindowOpen ? "" : "pr-[15.5rem]"
                                // }
                            >
                                {songData?.full != "" && element}
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
            <div className="absolute sm:bottom-1 bottom-14 right-2 z-50 flex items-center gap-4">
                <Button
                    className=" text-xs"
                    variant={"ghost"}
                    size={"icon"}
                    onClick={() => {
                        handlers.onRestart?.();
                    }}
                >
                    <ReloadIcon />
                </Button>
                <TextModificationDialog />
            </div>
            <div className="absolute sm:bottom-2 bottom-14 left-2 text-xs text-muted-foreground flex items-center gap-1 z-0">
                <SmallStats
                    timeElapsed={progressManager.timeElapsed}
                    focusedOnInput={focusedOnInput}
                    userInputLength={progressManager.userInput.length}
                />
            </div>
        </div>
    );
}

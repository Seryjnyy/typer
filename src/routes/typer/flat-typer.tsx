import { ScrollArea } from "@/components/ui/scroll-area";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import AutoplayMsg from "./footer/autoplay-msg";
import Buttons from "./footer/buttons";
import CompletionAnim from "./footer/completion-anim";
import Stats from "./footer/stats";
import { Handlers, ProgressManager, SongData } from "./types";
import { convertSongToElements } from "./utils";
import { cn } from "@/lib/utils";
import ErrorAnim from "./footer/error-anim";

interface FlatTyperProps {
    progressManager: ProgressManager;
    songData: SongData;
    handlers: Handlers;
    children?: ReactNode;
    tryVerseOption?: boolean;
    versePage?: boolean;
}

export default function FlatTyper({
    progressManager,
    songData,
    handlers,
    children,
    tryVerseOption,
    versePage,
}: FlatTyperProps) {
    const [focusedOnInput, setFocusedOnInput] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const generatorResult = useMemo(
        () =>
            convertSongToElements(
                songData?.content.full ?? "",
                progressManager.userInput,
                handlers.onClickVerse,
                tryVerseOption
            ),
        [songData?.content.full, progressManager.userInput]
    );

    const { elements, startOfLineIndexes, startOfLineRefs, stats } = useMemo(
        () => generatorResult,
        [generatorResult]
    );

    useEffect(() => {
        console.log(generatorResult.errorIndex);
        if (generatorResult.errorIndex != null) {
            progressManager.recordError(generatorResult.errorIndex);
        }
    }, [generatorResult.errorIndex]);

    const onUserInput = (input: string) => {
        if (songData?.content.full == "") return;

        progressManager.setUserInput(input);

        const finished = input.length == songData?.content.stripped.length;
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
            songData?.content.stripped != undefined
                ? songData.content.stripped.length
                : 0
        );
    }, [songData?.content.full]);

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

            if (songData?.content.full != "" && !progressManager.completed) {
                inputRef.current?.focus();
                handlers.onStart?.();
            }
        }
    });

    useEffect(() => {
        progressManager.setCorrect(stats.correct);
        progressManager.setIncorrect(stats.incorrect);
    }, [stats]);

    return (
        <div className="relative h-full w-full   rounded-md overflow-hidden">
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
                                {songData?.content.full != "" && elements}
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

            {/* TODO : Duplicate code with cylinder typer */}
            <Buttons handlers={handlers} />
            {/* {generatorResult.errorIndex != null && ( */}
            <ErrorAnim errorIndex={generatorResult.errorIndex} />
            {/* )} */}
            <Stats
                focusedOnInput={focusedOnInput}
                progressManager={progressManager}
            />

            <CompletionAnim
                songData={songData}
                progressManager={progressManager}
            />

            {!versePage && <AutoplayMsg progressManager={progressManager} />}
        </div>
    );
}

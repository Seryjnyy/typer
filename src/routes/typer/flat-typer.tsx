import { ScrollArea } from "@/components/ui/scroll-area";
import {
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useHotkeys } from "react-hotkeys-hook";
import AutoplayMsg from "./footer/autoplay-msg";
import Buttons from "./footer/buttons";
import CompletionAnim from "./footer/completion-anim";
import Stats from "./footer/stats";
import { Handlers, ProgressManager, SongData } from "./types";

import { HarderOptions } from "@/lib/store/text-modifications-store";
import { cn } from "@/lib/utils";
import CorrectAnim from "./footer/correct-anim";
import ErrorAnim from "./footer/error-anim";

import Ch, { chVariant } from "@/components/ch";
import KeyboardButton from "@/components/keyboard-button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { splitSongIntoVerses } from "@/lib/utils";
import { isTryingToType } from "./utils";

export const convertSongToElements = (
    song: string,
    songStripped: string,
    userInput: string,
    direction: "backward" | "forward",
    difficultyModifiers: HarderOptions,
    tryVerseOption: boolean = false,
    onClickVerse?: (verse: string) => void
) => {
    if (song == undefined) {
        return {
            elements: [<></>],
            startOfLineIndexes: [],
            startOfLineRefs: [],
            errorIndex: null,
            stats: { correct: 0, incorrect: 0 },
        };
    }

    // const split = song?.content.split(/\r?\n/);
    const verseSplit = splitSongIntoVerses(song);

    let lineCounter = 0;
    let charIndex = 0;
    let startOfLineIndexes: number[] = [];
    let startOfLineRefs: Record<number, HTMLDivElement> = {};

    let correct = 0;
    let incorrect = 0;

    const elements = verseSplit.map((verse, i) => {
        const lines = verse.split(/\r?\n/);

        const verseElements = lines.map((line, j) => {
            if (line == "") {
                return (
                    <div className="bg-blue-200 opacity-5" key={"" + i + j}>
                        {"- "}
                    </div>
                );
            }

            const arrayFromLine = Array.from(line);
            const formatedLine = (
                <div
                    key={"" + i + j}
                    ref={(el) => {
                        if (!el) return null;

                        startOfLineRefs[lineCounter] = el;
                        lineCounter++;
                    }}
                >
                    {arrayFromLine.map((ch, k) => {
                        let variant: chVariant = "not-covered";

                        if (k == 0) {
                            startOfLineIndexes.push(charIndex);
                        }

                        if (charIndex > userInput.length) {
                            // variant = "not-covered";

                            if (difficultyModifiers.cantSeeAhead) {
                                if (ch != " ") {
                                    ch = "_";
                                }

                                if (!difficultyModifiers.cantSeeUnderlines) {
                                    variant = "normal";
                                } else {
                                    variant = "normalInvisible";
                                }
                            }
                        } else if (charIndex == userInput.length) {
                            variant = "current";
                            if (difficultyModifiers.cantSeeCurrent) {
                                if (ch != " ") {
                                    ch = "_";
                                }

                                if (!difficultyModifiers.cantSeeUnderlines) {
                                    variant = "current";
                                } else {
                                    variant = "currentInvisible";
                                }
                            } else {
                                variant = "current";
                            }
                        } else {
                            if (ch == userInput.charAt(charIndex)) {
                                correct++;
                                variant = "correct";
                            } else {
                                incorrect++;
                                variant = "incorrect";
                                if (ch == " " || ch == "\n") {
                                    variant = "incorrect-space";
                                }
                            }
                        }

                        charIndex++;
                        return (
                            <Ch key={"" + i + j + k} variant={variant}>
                                {ch}
                            </Ch>
                        );
                    })}
                </div>
            );

            return formatedLine;
        });

        return (
            <div
                key={i}
                className={cn(
                    " mb-4 p-2 rounded-md relative group/verse sm:leading-8 leading-10",
                    {
                        "hover:outline": tryVerseOption,
                    }
                )}
            >
                {verseElements}
                {tryVerseOption && (
                    <TooltipProvider delayDuration={1200}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <KeyboardButton
                                    onClick={() => onClickVerse?.(verse)}
                                    variant={"verse"}
                                />
                            </TooltipTrigger>
                            <TooltipContent className="group-hover/verse:block hidden">
                                <p>Attempt this part only</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>
        );
    });

    let errorIndex = null;
    if (userInput.length - 1 >= 0) {
        if (
            songStripped.charAt(userInput.length - 1) !=
            userInput.charAt(userInput.length - 1)
        ) {
            errorIndex = userInput.length - 1;
        }
    }
    return {
        elements: elements.map((x, i) => {
            if (i < elements.length - 1) {
                return (
                    <>
                        {x}
                        <span className="py-4 mx-auto opacity-50 text-md font-normal">
                            {"𝆕"}
                        </span>
                    </>
                );
            }
            return x;
        }),
        startOfLineIndexes: startOfLineIndexes,
        startOfLineRefs: startOfLineRefs,
        stats: { correct: correct, incorrect: incorrect },
        errorIndex: direction == "backward" ? null : errorIndex,
    };
};

interface FlatTyperProps {
    progressManager: ProgressManager;
    songData: SongData;
    handlers: Handlers;
    difficultyModifiers: HarderOptions;
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
    difficultyModifiers,
}: FlatTyperProps) {
    const [focusedOnInput, setFocusedOnInput] = useState(false);
    const [currentAction, setCurrentAction] = useState<"forward" | "backward">(
        "forward"
    );

    const inputRef = useRef<HTMLTextAreaElement>(null);
    const generatorResult = useMemo(() => {
        console.log(currentAction);
        const res = convertSongToElements(
            songData?.content.full ?? "",
            songData?.content.stripped ?? "",
            progressManager.userInput,
            currentAction,
            difficultyModifiers,
            tryVerseOption,
            handlers.onClickVerse
        );

        return res;
    }, [
        songData?.content.full,
        progressManager.userInput,
        difficultyModifiers,
    ]);

    const { elements, startOfLineIndexes, startOfLineRefs, stats } = useMemo(
        () => generatorResult,
        [generatorResult]
    );

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
            let newAction = "";

            if (event.key === "Backspace") {
                newAction = "backward";
            } else if (event.key.length === 1) {
                // Single character keys
                newAction = "forward";
            }

            if (newAction != "forward" && newAction != "backward") return;

            if (newAction) {
                setCurrentAction(newAction);
            }
        },
        []
    );

    useEffect(() => {
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

        // Check if input is letters, numbers, punctuation or backspace
        if (isTryingToType(key)) {
            // focus
            inputRef.current?.focus();

            if (songData?.content.full != "" && !progressManager.completed) {
                inputRef.current?.focus();
                handlers.onStart?.();
            }
        }
    });

    // TODO : abandoned for now cause it doesn't work correctly, seconds and stuff is not recorded after pressing esc
    // but somehow reset button works just fine when using the same handler.onRestart function
    // useHotkeys(
    //     "esc",
    //     () => {
    //         handlers.onRestart?.();
    //     },
    //     { enableOnFormTags: true },
    // );

    useEffect(() => {
        progressManager.setCorrect(stats.correct);
        progressManager.setIncorrect(stats.incorrect);
    }, [stats]);

    return (
        <div className="relative h-full w-full   rounded-md overflow-hidden">
            <ScrollArea className="h-full  relative z-10 ">
                <div className="w-full h-full ">
                    <div className="flex justify-start">
                        <div className="flex justify-center w-full py-24 relative">
                            <div className="text-2xl font-semibold flex flex-col text-center px-1 sm:px-2 ">
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
                                onKeyDown={(e) => handleKeyDown(e)}
                            />
                        </div>
                    </div>
                </div>
            </ScrollArea>

            {/* TODO : Duplicate code with cylinder typer */}
            <Buttons handlers={handlers} />

            {generatorResult.errorIndex != null && (
                <ErrorAnim errorIndex={generatorResult.errorIndex} />
            )}
            {currentAction == "forward" &&
                generatorResult.errorIndex == null && (
                    <CorrectAnim
                        index={
                            progressManager.userInput.length > 0
                                ? progressManager.userInput.length
                                : null
                        }
                    />
                )}
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

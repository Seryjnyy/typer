import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowRightIcon, KeyboardIcon } from "@radix-ui/react-icons";
import { throttle } from "lodash";
import {
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useHotkeys } from "react-hotkeys-hook";
import Ch, { chVariant } from "../../components/ch";
import { Progress } from "../../components/ui/progress";
import { Song } from "../../lib/types";
import { cn } from "../../lib/utils";
import { HarderOptions } from "@/lib/store/text-modifications-store";
import KeyboardButton from "@/components/keyboard-button";

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
    songData: {
        song: Song;
        songContent: { full: string; stripped: string };
    } | null;
    handlers: Handlers;
    difficultyModifiers: HarderOptions;
    children?: ReactNode;
    tryVerseOption?: boolean;
    className?: string;
}

const splitSongIntoLines = (song: string) => {
    const linesVerseMap: {
        id: number;
        lines: string[];
        verse: string;
    }[] = [];
    const verseSplit = song.split(/\n\s*\n/);
    let lineCount = 0;
    verseSplit.forEach((verse, verseIndex) => {
        const tempLines = verse.split(/\r?\n/);

        linesVerseMap.push({
            id: verseIndex,
            lines: tempLines,
            verse,
        });

        lineCount += tempLines.length;
    });

    return {
        linesVerseMap: linesVerseMap,
        verses: verseSplit,
        lineCount: lineCount,
    };
};

const convertStuff = (
    songContent: string,
    userInput: string,
    curr: number,
    tryVerse: boolean,
    difficultyModifiers: HarderOptions,
    onClickVerse?: (verse: string) => void
) => {
    // lineVerseMap maps EVERY line to a verse
    const newSplit = splitSongIntoLines(songContent);

    const drawLines: ReactNode[] = [];

    const midpoint = Math.floor(newSplit.lineCount / 2);
    const start = -midpoint;

    let correct = 0;
    let incorrect = 0;

    const angle = 10.5;
    // TODO : need to decide this on size of the screen, e.g mobile needs to be less
    const lineLimit = 6;

    let lineIndex = 0;
    let chIndex = 0;
    let currentLine = 0;
    newSplit.linesVerseMap.forEach((x, verseIndex) => {
        // render stops verses from being added, however it still does the computation and stuff
        let render = true;
        // const ress: ReactNode[] = [];
        const lines = x.lines.map((line) => {
            const transform = `rotateX(calc(${
                start + lineIndex + midpoint + curr
            }*${angle}deg))`;
            const fontSizeOffset =
                10 - Math.abs(start + lineIndex + midpoint + curr);
            const fontSize = `${fontSizeOffset * 3}px`;
            const fontColourOffset =
                1 -
                Math.abs(start + lineIndex + midpoint + curr) * (1 / lineLimit);
            const fontColour = `rgb(255 255 255 / ${fontColourOffset})`;
            const fontWeight =
                start + lineIndex + midpoint + curr == 0 ? "bold" : "normal";

            if (
                start + lineIndex + midpoint + curr < -lineLimit ||
                start + lineIndex + midpoint + curr > lineLimit
            ) {
                lineIndex++;
                Array.from(line).forEach((x) => chIndex++);
                render = false;
                return null;
            }

            const formattedLine = Array.from(line).map((ch) => {
                let variant: chVariant = "normal";

                if (chIndex > userInput.length) {
                    // not covered yet

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
                } else if (chIndex == userInput.length) {
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
                    if (ch == userInput.charAt(chIndex)) {
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

                // if (variant == "normal" && difficultyModifiers.cantSeeAhead) {
                //     variant = "normalInvisible";
                // }

                if (chIndex == userInput.length + 1) {
                    currentLine = -lineIndex;
                }

                chIndex++;

                return <Ch variant={variant}>{ch}</Ch>;
            });

            lineIndex++;

            // ress.push(
            //     <div
            //         className="text-center w-full"
            //         key={lineIndex}
            //         style={{
            //             transform: transform,
            //             fontSize: fontSize,
            //             lineHeight: 1,
            //             fontWeight: fontWeight,
            //             color: fontColour,
            //         }}
            //     >
            //         {formattedLine}
            //     </div>
            // );
            return (
                <div
                    className="text-center w-full"
                    key={lineIndex}
                    style={{
                        transform: transform,
                        fontSize: fontSize,
                        lineHeight: 1,
                        fontWeight: fontWeight,
                        color: fontColour,
                    }}
                >
                    {formattedLine}
                </div>
            );
        });

        if (lines.length != 0) {
            drawLines.push(
                <div
                    className={cn("rounded-md", {
                        "hover:outline hover:outline-border group/verse relative  px-2":
                            lines.length > 2 && tryVerse,
                    })}
                >
                    {...lines}
                    {lines.length > 2 && tryVerse && (
                        <TooltipProvider delayDuration={1200}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <KeyboardButton
                                        onClick={() => onClickVerse?.(x.verse)}
                                        variant={"verse"}
                                    />
                                </TooltipTrigger>
                                <TooltipContent className="group-hover/verse:block hidden ">
                                    <p>Attempt this part only. </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
            );

            if (
                lines.length != 0 &&
                verseIndex < newSplit.linesVerseMap.length - 1
            ) {
                const transform = `rotateX(calc(${
                    start + lineIndex - 1 + midpoint + curr
                }*${angle}deg))`;
                const fontSizeOffset =
                    10 - Math.abs(start + lineIndex - 1 + midpoint + curr);
                const fontSize = `${fontSizeOffset * 3}px`;
                const fontColourOffset =
                    1 -
                    Math.abs(start + lineIndex + midpoint + curr) *
                        (1 / lineLimit);
                const fontColour = `rgb(255 255 255 / ${fontColourOffset})`;
                const fontWeight =
                    start + lineIndex + midpoint + curr == 0
                        ? "bold"
                        : "normal";

                drawLines.push(
                    <div
                        className="text-center w-full opacity-50"
                        key={lineIndex + chIndex}
                        style={{
                            color: fontColour,
                            fontWeight: fontWeight,
                            transform: transform,
                            fontSize: fontSize,
                            lineHeight: 1,
                        }}
                    >
                        {"𝆕"}
                    </div>
                );
            }
        }
    });

    return {
        elements: drawLines,
        linesCount: newSplit.lineCount,
        newLineIndexes: [],
        stats: { correct: 0, incorrect: 0 },
        currentLine: currentLine,
    };
};

export default function Test({
    songData,
    progressManager,
    handlers,
    children,
    className,
    difficultyModifiers,
}: TypingProps) {
    const [focusedOnInput, setFocusedOnInput] = useState(false);
    const [curr, setCurr] = useState(0);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const { elements, linesCount, newLineIndexes, stats, currentLine } =
        useMemo(() => {
            return convertStuff(
                songData?.songContent.full ?? "no song",
                progressManager.userInput,
                curr,
                true,
                difficultyModifiers,
                handlers.onClickVerse
            );
        }, [songData, curr, progressManager.userInput, difficultyModifiers]);

    const scrollDivRef = useRef<HTMLDivElement>(null);

    const onUserInput = (input: string) => {
        if (!songData) return;

        progressManager.setUserInput(input);

        const finished = input.length == songData.songContent.stripped.length;
        if (finished) {
            progressManager.setCompleted(true);
            // handlers.onFinish?.();
        }

        progressManager.setTypedCharCount(input.length);

        console.log("currentLine", currentLine);
        setCurr(currentLine);
    };

    useEffect(() => {
        handlers.onChangeSong?.();

        progressManager.setTargetCharCount(
            songData ? songData.songContent.stripped.length : 0
        );

        setCurr(0);
    }, [songData]);

    useHotkeys("[", () => {
        changeCurrVal(-1);
    });

    const changeCurrVal = (amount: number) => {
        let newVal = curr + amount;
        if (newVal < -linesCount || newVal > 0) return;

        // while (newLineIndexes.includes(-newVal)) {
        //     if (newVal > curr) {
        //         newVal++;
        //     } else {
        //         newVal--;
        //     }
        // }

        setCurr(newVal);
    };

    useHotkeys("]", () => {
        changeCurrVal(1);
    });

    // TODO : Low value for smooth scrolling but then one scroll and it flies through everything idk
    const handleScroll = throttle((event: WheelEvent) => {
        if (scrollDivRef.current) {
            if (event.deltaY > 0) {
                setCurr((prev) => {
                    if (prev - 1 < -linesCount) return prev;
                    return prev - 1;
                });
            } else if (event.deltaY < 0) {
                setCurr((prev) => {
                    if (prev + 1 > 0) return prev;
                    return prev + 1;
                });
            }
        }
    }, 300);

    useEffect(() => {
        const div = scrollDivRef.current;
        if (div) {
            div.addEventListener("wheel", handleScroll);

            return () => {
                div.removeEventListener("wheel", handleScroll);
            };
        }
    }, [handleScroll]);

    useHotkeys("*", () => {
        // focus
        inputRef.current?.focus();

        if (!songData && !progressManager.completed) {
            handlers.onStart?.();
        }
    });

    useEffect(() => {
        progressManager.setCorrect(stats.correct);
        progressManager.setIncorrect(stats.incorrect);
    }, [stats]);

    return (
        <div
            className={cn(
                "flex justify-center items-center w-full h-screen flex-col space-y-2 relative ",
                className
            )}
            ref={scrollDivRef}
        >
            <Progress
                value={((-curr + 1) / linesCount) * 100}
                className="absolute rotate-90 w-[5rem] left-0 opacity-60"
            />
            {children}
            {/* <div
                className={`space-y-2 ${songData?.song.cover} p-12 rounded-md w-[90%] h-[60%] absolute opacity-35`}
                
            >
                Maybe add this idk
            </div> */}
            {elements}
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
    );
}

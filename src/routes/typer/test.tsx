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
    children?: ReactNode;
    tryVerseOption?: boolean;
    className?: string;
}

const splitSongIntoLines = (song: string) => {
    const verseSplit = song.split(/\n\s*\n/);

    const lines: string[] = [];
    const verses: string[] = [];
    const lineVerseMap: Record<number, number> = {};
    let lineIndex = 0;

    verseSplit.forEach((verse, verseIndex) => {
        const tempLines = verse.split(/\r?\n/);

        lines.push(...tempLines, "𝆕");

        verses.push(verse);

        tempLines.forEach(() => {
            lineVerseMap[lineIndex] = verseIndex;
            lineIndex++;
        });

        lineVerseMap[lineIndex] = verseIndex;
        lineIndex++;
    });

    return { lines: lines, verses: verses, lineVerseMap: lineVerseMap };
};

const convertStuff = (
    songContent: string,
    userInput: string,
    curr: number,
    tryVerse: boolean,
    onClickVerse?: (verse: string) => void
) => {
    const {
        lines: songLines,
        verses: songVerses,
        lineVerseMap: lineVerseMap,
    } = splitSongIntoLines(songContent ?? "");
    const midpoint = Math.floor(songLines.length / 2);
    const start = -midpoint;

    let correct = 0;
    let incorrect = 0;

    const angle = 10.5;
    const lineLimit = 8;
    let tempElements: ReactNode[] = [];
    const newLineIndexes: number[] = [];
    songLines.forEach((x, i) => {
        if (x == "𝆕") {
            newLineIndexes.push(i);
        }
    });

    let tempLines = [];
    let charIndex = 0;
    let verseIndex = 0;
    let currentLine = 0;
    for (let i = 0; i < songLines.length; i++) {
        if (
            start + i + midpoint + curr < -lineLimit ||
            start + i + midpoint + curr > lineLimit
        ) {
            if (tempLines.length > 0) {
                tempElements.push(
                    <div
                        key={"verse" + i}
                        className="hover:outline hover:outline-border hover:outline-1 rounded-lg"
                    >
                        {...tempLines}
                    </div>
                );
                tempLines = [];
                verseIndex++;
            }
            continue;
        }

        const transform = `rotateX(calc(${
            start + i + midpoint + curr
        }*${angle}deg))`;
        const fontSizeOffset = 10 - Math.abs(start + i + midpoint + curr);
        const fontSize = `${fontSizeOffset * 3}px`;
        const fontColourOffset =
            1 - Math.abs(start + i + midpoint + curr) * (1 / lineLimit);
        const fontColour = `rgb(255 255 255 / ${fontColourOffset})`;
        const fontWeight = start + i + midpoint + curr == 0 ? "bold" : "normal";

        if (songLines[i] == "𝆕") {
            tempElements.push(
                <div
                    key={"verse" + i}
                    className={cn("rounded-md", {
                        "hover:outline hover:outline-border group/verse relative":
                            tryVerse,
                    })}
                >
                    {...tempLines}
                    {tryVerse && (
                        <TooltipProvider delayDuration={1200}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        className="absolute -bottom-4 right-0 group-hover/verse:flex group-hover/verse:bg-primary hidden gap-2 group/button"
                                        onClick={() => {
                                            onClickVerse?.(
                                                songVerses[lineVerseMap[i]]
                                            );
                                        }}
                                    >
                                        <KeyboardIcon />
                                        <ArrowRightIcon className="group-hover/button:translate-x-1 transition-transform opacity-60" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="group-hover/verse:block hidden">
                                    <p>Attempt this part only. </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
            );
            tempLines = [];
            verseIndex++;

            tempElements.push(
                <div
                    className="text-center w-full"
                    key={i}
                    style={{
                        transform: transform,
                        fontSize: fontSize,
                        lineHeight: 1,
                        fontWeight: fontWeight,
                        color: fontColour,
                    }}
                >
                    {songLines[i]}
                </div>
            );
        } else {
            tempLines.push(
                <div
                    className="text-center w-full"
                    key={i}
                    style={{
                        transform: transform,
                        fontSize: fontSize,
                        lineHeight: 1,
                        fontWeight: fontWeight,
                        color: fontColour,
                    }}
                >
                    {Array.from(songLines[i]).map((ch, k) => {
                        let variant: chVariant = "normal";

                        if (charIndex > userInput.length) {
                            // variant = "not-covered";
                        } else if (charIndex == userInput.length) {
                            variant = "current";
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
                            <Ch key={"" + i + k} variant={variant}>
                                {ch}
                            </Ch>
                        );
                    })}
                </div>
            );
        }
    }

    if (tempLines.length > 0) {
        tempElements.push(...tempLines);
    }

    return {
        elements: tempElements,
        linesCount: songLines.length,
        newLineIndexes: newLineIndexes,
        stats: { correct: correct, incorrect: incorrect },
    };
};

export default function Test({
    songData,
    progressManager,
    handlers,
    children,
    className,
}: TypingProps) {
    const [focusedOnInput, setFocusedOnInput] = useState(false);
    const [curr, setCurr] = useState(0);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const { elements, linesCount, newLineIndexes, stats } = useMemo(() => {
        return convertStuff(
            songData?.songContent.full ?? "no song",
            progressManager.userInput,
            curr,
            true,
            handlers.onClickVerse
        );
    }, [
        songData?.song,
        songData,
        songData?.songContent,
        curr,
        progressManager.userInput,
    ]);

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

        while (newLineIndexes.includes(-newVal)) {
            if (newVal > curr) {
                newVal++;
            } else {
                newVal--;
            }
        }

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
    }, 50);

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
                "flex justify-center items-center w-full h-screen flex-col text-xl space-y-2 relative",
                className
            )}
            ref={scrollDivRef}
        >
            <Progress
                value={((-curr + 1) / linesCount) * 100}
                className="absolute rotate-90 w-[5rem] left-0 opacity-60"
            />
            {children}
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

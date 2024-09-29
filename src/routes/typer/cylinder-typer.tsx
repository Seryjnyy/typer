import KeyboardButton from "@/components/keyboard-button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import useScreenSize from "@/lib/hooks/use-screen-size";
import { HarderOptions } from "@/lib/store/text-modifications-store";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
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
import { cn, splitSongIntoVerses } from "../../lib/utils";
import AutoplayMsg from "./footer/autoplay-msg";
import Buttons from "./footer/buttons";
import CompletionAnim from "./footer/completion-anim";
import Stats from "./footer/stats";
import { Handlers, ProgressManager, SongData } from "./types";
import ErrorAnim from "./footer/error-anim";
import CorrectAnim from "./footer/correct-anim";
import { isTryingToType } from "./utils";

interface CylinderTyperProps {
    progressManager: ProgressManager;
    songData: SongData;
    handlers: Handlers;
    difficultyModifiers: HarderOptions;
    children?: ReactNode;
    tryVerseOption?: boolean;
    className?: string;
    versePage?: boolean;
}

const splitSongIntoLines = (song: string) => {
    const linesVerseMap: {
        id: number;
        lines: string[];
        verse: string;
    }[] = [];
    const verseSplit = splitSongIntoVerses(song);
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

const calculateLineStyle = (
    start: number,
    lineIndex: number,
    midpoint: number,
    curr: number,
    lineLimit: number,
    angle: number,
    isSmallScreen: boolean
) => {
    const transform = `rotateX(calc(${
        start + lineIndex + midpoint + curr
    }*${angle}deg))`;
    const fontSizeOffset = 10 - Math.abs(start + lineIndex + midpoint + curr);

    const fontSizeModifier = isSmallScreen ? 2 : 3;
    const fontSize = `${fontSizeOffset * fontSizeModifier}px`;
    const fontColourOffset =
        1 - Math.abs(start + lineIndex + midpoint + curr) * (1 / lineLimit);
    let fontColour = `rgb(255 255 255 / ${fontColourOffset / 3})`;
    fontColour =
        start + lineIndex + midpoint + curr == 0
            ? "rgb(255 255 255)"
            : fontColour;
    const fontWeight =
        start + lineIndex + midpoint + curr == 0 ? "bold" : "normal";

    // const fontColour = `rgb(255 255 255 / ${fontColourOffset})`;

    return {
        transform: transform,
        fontSize: fontSize,
        fontColour: fontColour,
        fontWeight: fontWeight,
        fontSizeOffset: fontSizeOffset,
        fontColourOffset: fontColourOffset,
    };
};

const convertStuff = (
    songContent: string,
    songContentStripped: string,
    userInput: string,
    curr: number,
    tryVerse: boolean,
    difficultyModifiers: HarderOptions,
    isSmallScreen: boolean,
    direction: string,
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

    // TODO : works well with 8, however when too far the outline and try verse shows on bascially nothing
    let lineLimit = 8;

    let lineIndex = 0;
    let chIndex = 0;
    let currentLine = 0;
    newSplit.linesVerseMap.forEach((x, verseIndex) => {
        // render stops verses from being added, however it still does the computation and stuff

        const lines = x.lines.map((line, j) => {
            const style = calculateLineStyle(
                start,
                lineIndex,
                midpoint,
                curr,
                lineLimit,
                angle,
                isSmallScreen
            );
            if (
                start + lineIndex + midpoint + curr < -lineLimit ||
                start + lineIndex + midpoint + curr > lineLimit
            ) {
                lineIndex++;
                Array.from(line).forEach(() => chIndex++);
                // console.log("result of line", chIndex);
                return null;
            }

            const formattedLine = Array.from(line).map((ch, k) => {
                let variant: chVariant = "normal";

                if (chIndex > userInput.length) {
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

                // Plus one so it moves to next line without having to type the first ch of new line
                if (chIndex == userInput.length) {
                    console.log(line);
                    currentLine = -lineIndex;
                }

                chIndex++;

                return (
                    <Ch variant={variant} key={"" + verseIndex + "" + j + k}>
                        {ch}
                    </Ch>
                );
            });

            lineIndex++;

            return (
                <div
                    className="text-center w-full"
                    key={lineIndex}
                    style={{
                        transform: style.transform,
                        fontSize: style.fontSize,
                        lineHeight: 1,
                        fontWeight: style.fontWeight,
                        color: style.fontColour,
                    }}
                >
                    {formattedLine}
                </div>
            );
        });

        if (lines.length != 0) {
            drawLines.push(
                <div
                    key={verseIndex}
                    className={cn("rounded-md", {
                        "hover:outline hover:outline-border group/verse relative  px-2":
                            lines.length > 0 && tryVerse,
                    })}
                >
                    {...lines}
                    {lines.length > 0 && tryVerse && (
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
                const style = calculateLineStyle(
                    start,
                    lineIndex,
                    midpoint,
                    curr,
                    lineLimit,
                    angle,
                    isSmallScreen
                );

                drawLines.push(
                    <div
                        className="text-center w-full opacity-50"
                        key={verseIndex + "empty"}
                        style={{
                            color: `rgb(255 255 255 / ${style.fontColourOffset})`,
                            fontWeight: style.fontWeight,
                            transform: style.transform,
                            fontSize: style.fontSize,
                            lineHeight: 1,
                        }}
                    >
                        {"𝆕"}
                    </div>
                );
            }
        }
    });

    let errorIndex = null;

    if (userInput.length - 1 >= 0) {
        if (
            songContentStripped.charAt(userInput.length - 1) !=
            userInput.charAt(userInput.length - 1)
        ) {
            errorIndex = userInput.length - 1;
        }
    }

    return {
        elements: drawLines,
        linesCount: newSplit.lineCount,
        errorIndex: direction == "backward" ? null : errorIndex,
        stats: { correct: correct, incorrect: incorrect },
        currentLine: currentLine,
    };
};

export default function CylinderTyper({
    songData,
    progressManager,
    handlers,
    children,
    className,
    difficultyModifiers,
    tryVerseOption,
    versePage,
}: CylinderTyperProps) {
    const [focusedOnInput, setFocusedOnInput] = useState(false);
    const [curr, setCurr] = useState(0);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [currentAction, setCurrentAction] = useState<"forward" | "backward">(
        "forward"
    );

    const { isMd } = useScreenSize();

    // console.log("actual curr", curr);
    const generatorResult = useMemo(() => {
        // console.log("curr", curr);
        return convertStuff(
            songData?.content.full ?? "",
            songData?.content.stripped ?? "",
            progressManager.userInput,
            curr,
            tryVerseOption ?? false,
            difficultyModifiers,
            isMd ? false : true,
            currentAction,
            handlers.onClickVerse
        );
    }, [songData, curr, progressManager.userInput, difficultyModifiers, isMd]);

    const { elements, linesCount, stats, currentLine } = useMemo(
        () => generatorResult,
        [generatorResult]
    );

    useEffect(() => {
        setCurr(currentLine);
    }, [currentLine]);

    // console.log("current line", currentLine);

    useEffect(() => {
        if (generatorResult.errorIndex != null) {
            progressManager.recordError(generatorResult.errorIndex);
        }
    }, [generatorResult.errorIndex]);

    const scrollDivRef = useRef<HTMLDivElement>(null);

    const onUserInput = (input: string) => {
        if (songData?.content.full == "") return;

        progressManager.setUserInput(input);

        const finished = input.length == songData?.content.stripped.length;
        if (finished) {
            progressManager.setCompleted(true);
            handlers.onFinish?.();
        }

        progressManager.setTypedCharCount(input.length);

        setCurr(currentLine);
    };

    useEffect(() => {
        handlers.onChangeSong?.();

        progressManager.setTargetCharCount(
            songData?.content.stripped != undefined
                ? songData.content.stripped.length
                : 0
        );

        setCurr(0);
    }, [songData?.content.full]);

    const changeCurrVal = (amount: number) => {
        let newVal = curr + amount;
        if (newVal < -linesCount || newVal > 0) return;

        setCurr(newVal);
    };

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

    useHotkeys(
        "ArrowLeft,ArrowUp",
        () => {
            changeCurrVal(1);
        },
        { enableOnFormTags: true }
    );

    useHotkeys(
        "ArrowRight,ArrowDown",
        () => {
            changeCurrVal(-1);
        },
        { enableOnFormTags: true }
    );

    useEffect(() => {
        progressManager.setCorrect(stats.correct);
        progressManager.setIncorrect(stats.incorrect);
    }, [stats]);

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

    return (
        <div
            className={cn(
                " w-full h-[calc(100vh-5rem)] relative  overflow-hidden rounded-md",
                className
            )}
            ref={scrollDivRef}
        >
            <div className="absolute   top-2    right-[50%] translate-x-[50%] opacity-60 flex items-center gap-2 text-primary">
                <ChevronLeftIcon />
                <Progress
                    value={(-curr / linesCount) * 100}
                    className="w-[5rem]"
                />
                <ChevronRightIcon />
            </div>
            <div className="space-y-3 sm:space-y-2 z-30  flex-col flex justify-center items-center pt-[4rem]">
                {elements}
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
            <Buttons handlers={handlers} />

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

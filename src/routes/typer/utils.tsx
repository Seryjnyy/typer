import Ch, { chVariant } from "@/components/ch";
import KeyboardButton from "@/components/keyboard-button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { HarderOptions } from "@/lib/store/text-modifications-store";
import { cn, splitSongIntoVerses } from "@/lib/utils";

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

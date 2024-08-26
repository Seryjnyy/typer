import Ch, { chVariant } from "@/components/ch";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, KeyboardIcon } from "@radix-ui/react-icons";

export const convertSongToElements = (
    song: string,
    userInput: string,
    onClickVerse?: (verse: string) => void,
    tryVerseOption: boolean = false
) => {
    if (song == undefined) {
        return {
            element: <></>,
            startOfLineIndexes: [],
            startOfLineRefs: [],
            correct: 0,
            incorrect: 0,
        };
    }

    // const split = song?.content.split(/\r?\n/);
    const verseSplit = song.split(/\n\s*\n/);

    let lineCounter = 0;
    let charIndex = 0;
    let startOfLineIndexes: number[] = [];
    let startOfLineRefs: Record<number, HTMLDivElement> = {};

    let correct = 0;
    let incorrect = 0;

    const element = verseSplit.map((verse, i) => {
        const lines = verse.split(/\r?\n/);

        const verseElements = lines.map((line, j) => {
            if (line == "") {
                return (
                    <div className="bg-blue-200 opacity-5" key={"" + i + j}>
                        {"- "}
                    </div>
                );
            }

            const formatedLine = (
                <div
                    key={"" + i + j}
                    ref={(el) => {
                        if (!el) return null;

                        startOfLineRefs[lineCounter] = el;
                        lineCounter++;
                    }}
                >
                    {Array.from(line).map((ch, k) => {
                        let variant: chVariant = "not-covered";

                        if (k == 0) {
                            variant = "start-of-line";
                            startOfLineIndexes.push(charIndex);
                        }

                        if (charIndex > userInput.length) {
                            variant = "not-covered";
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
                className={cn(" mb-4 p-2 rounded-md relative group/verse", {
                    "hover:outline": tryVerseOption,
                })}
                onClick={() => onClickVerse?.(verse)}
            >
                {verseElements}
                {tryVerseOption && (
                    <TooltipProvider delayDuration={1200}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button className="absolute -bottom-4 right-0 group-hover/verse:flex group-hover/verse:bg-primary hidden gap-2 group/button">
                                    <KeyboardIcon />
                                    <ArrowRightIcon className="group-hover/button:translate-x-1 transition-transform opacity-60" />
                                </Button>
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

    return {
        element: element,
        startOfLineIndexes: startOfLineIndexes,
        startOfLineRefs: startOfLineRefs,
        correct: correct,
        incorrect: incorrect,
    };
};

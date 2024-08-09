import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "./components/ui/button";
import { useHotkeys } from "react-hotkeys-hook";
import { useQueueStore } from "./lib/store/queue-store";
import { useSongStore } from "./lib/store/song-store";
import { useSongProgressStore } from "./lib/store/song-progress-store";
import { useStopwatch } from "react-timer-hook";
import { round } from "./lib/utils";

// options
// Can split into a certain amount of lines or
// can split using verses (using "")
// can split using verses, then split by lines if needed

// display
// line by line
// verse by verse
// slide  verses, like show all text but the one your doing in the center

export default function LineTest() {
    const queue = useQueueStore();
    const songList = useSongStore.use.songs();
    const song = useMemo(
        () => songList.find((x) => x.id == queue.current),
        [songList, queue.current]
    );
    const songProgress = useSongProgressStore();
    const [userInput, setUserInput] = useState<string>("");
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const {
        totalSeconds,
        start: startStopwatch,
        pause: pauseStopwatch,
        reset: resetStopwatch,
    } = useStopwatch({
        autoStart: false,
    });
    // const startOfLineRefs = useRef<Record<number, HTMLDivElement> | null>({});

    useEffect(() => {
        const currentLineIndex = startOfLineIndexes.findIndex(
            (x) => x == userInput.length
        );
        if (currentLineIndex != -1) {
            if (startOfLineRefs) {
                startOfLineRefs[currentLineIndex].scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
                console.log("calling", currentLineIndex);
            }
        }
    }, [userInput]);

    useEffect(() => {
        setUserInput("");
        pauseStopwatch();
        resetStopwatch();
        songProgress.setSongTotalChar(
            song != undefined ? song.content.length : 0
        );
    }, [song]);

    useEffect(() => {
        songProgress.setSongTypedChar(userInput.length);
    }, [userInput]);

    useEffect(() => {
        songProgress.setTimeElapsed(totalSeconds);
    }, [totalSeconds]);

    const canPlay = song != undefined;
    useHotkeys("*", (k, handler) => {
        // focus
        inputRef.current?.focus();

        if (canPlay && !songProgress.completed) {
            inputRef.current?.focus();
            startStopwatch();
            // uiState.setFocus(true);
        }
    });

    const onUserInput = (input: string) => {
        const finished = userInput.length + 1 == song?.content.length;
        if (finished) {
            songProgress.setCompleted(true);
            if (queue.autoplay) {
                queue.next();
            }
        } else {
            setUserInput(input);
        }
    };

    const { element, startOfLineIndexes, startOfLineRefs, correct, incorrect } =
        useMemo(() => {
            const split = song?.content.split(/\r?\n/);
            let lineCounter = 0;
            let charIndex = 0;
            let startOfLineIndexes: number[] = [];
            let startOfLineRefs: Record<number, HTMLDivElement> = {};

            let correct = 0;
            let incorrect = 0;
            songProgress.setCorrect(correct);
            songProgress.setIncorrect(incorrect);
            return {
                element: (
                    <div>
                        {split?.map((line, i) => {
                            if (line == "")
                                return (
                                    <div className="bg-blue-200" key={i}>
                                        f
                                    </div>
                                );

                            return (
                                <div
                                    key={i}
                                    ref={(el) => {
                                        if (!el) return null;

                                        startOfLineRefs[lineCounter] = el;
                                        lineCounter++;
                                    }}
                                >
                                    {Array.from(line).map((ch, j) => {
                                        let className = "";
                                        // if (j == 0) {
                                        //     className = "bg-red-300";
                                        //     startOfLineIndexes.push(charIndex);
                                        // }

                                        if (charIndex > userInput.length) {
                                            className = "text-muted-foreground";
                                        } else if (
                                            charIndex == userInput.length
                                        ) {
                                            charIndex++;
                                            return (
                                                <span
                                                    className="rounded-md relative before:content-[''] before:bg-yellow-300  before:px-[0.08rem] before:animate-pulse text-muted-foreground"
                                                    key={j}
                                                >
                                                    {ch}
                                                </span>
                                            );
                                        } else {
                                            if (
                                                ch ==
                                                userInput.charAt(charIndex)
                                            ) {
                                                className = "text-green-200";
                                                correct++;
                                            } else {
                                                incorrect++;
                                                if (ch == " " || ch == "\n") {
                                                    charIndex++;
                                                    return (
                                                        <div
                                                            className="rounded-md bg-red-300 inline-block max-h-[1px] min-h-[1px] w-1"
                                                            key={j}
                                                        >
                                                            {ch}
                                                        </div>
                                                    );
                                                }
                                                className = "text-red-200";
                                            }
                                        }

                                        charIndex++;
                                        return (
                                            <span key={j} className={className}>
                                                {ch}
                                            </span>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                ),
                startOfLineIndexes: startOfLineIndexes,
                startOfLineRefs: startOfLineRefs,
                correct: correct,
                incorrect: incorrect,
            };
        }, [song, userInput]);

    return (
        <div className="flex justify-center pt-24">
            <div className="block fixed top-0">
                {/* {songProgress.completed ? "complete" : "not-completed"} */}
                {/* {userInput} */}
                {`correct ${songProgress.correct} incorrect ${
                    songProgress.incorrect
                } percentage ${round(
                    (songProgress.correct / userInput.length) * 100,
                    2
                )}`}
            </div>
            <div>{element}</div>

            <textarea
                value={userInput}
                onChange={(e) => onUserInput(e.target.value)}
                placeholder="what"
                className=" border opacity-0 fixed"
                ref={inputRef}
                disabled={songProgress.completed}
            />
        </div>
    );
}

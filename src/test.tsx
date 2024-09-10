import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { throttle } from "lodash";
import { Progress } from "./components/ui/progress";
import { useQueueStore } from "./lib/store/queue-store";
import { useSongStore } from "./lib/store/song-store";
import { Song } from "./lib/types";
import Ch, { chVariant } from "./components/ch";

const convertSongToElements = (song: string, userInput: string) => {
    const verseSplit = song.split(/\n\s*\n/);
    const result: ReactNode[] = [];

    let lineIndex = 0;
    let charIndex = 0;

    return verseSplit.map((verse, verseIndex) => {
        const lines = verse.split(/\r?\n/);

        const lineElements = lines.map((line, j) => {
            if (line == "") {
                return null;
            }

            const formatedLine = (
                <div>
                    {Array.from(line).map((ch, k) => {
                        let variant: chVariant = "not-covered";

                        if (charIndex > userInput.length) {
                            variant = "not-covered";
                        } else if (charIndex == userInput.length) {
                            variant = "current";
                        } else {
                            if (ch == userInput.charAt(charIndex)) {
                                // correct++;
                                variant = "correct";
                            } else {
                                // incorrect++;
                                variant = "incorrect";
                                if (ch == " " || ch == "\n") {
                                    variant = "incorrect-space";
                                }
                            }
                        }

                        charIndex++;
                        return (
                            <Ch key={"" + verseIndex + j + k} variant={variant}>
                                {ch}
                            </Ch>
                        );
                    })}
                </div>
            );

            return formatedLine;
        });

        // result.push(
        //     <div className="hover:text-red-400">
        //         {lines.map((line) => (
        //             <div>{line}</div>
        //         ))}
        //     </div>
        // );
        return lineElements;
    });

    // return result;
};

const splitSongIntoLines = (song: string) => {
    const verseSplit = song.split(/\n\s*\n/);

    const res: string[] = [];
    verseSplit.map((verse, verseIndex) => {
        const lines = verse.split(/\r?\n/);
        res.push(...lines, "𝆕");
    });

    return res;
};

export default function Test() {
    const [curr, setCurr] = useState(0);
    const currentSongInQueue = useQueueStore.use.current();
    const songList = useSongStore.use.songs();

    const songData: {
        song: Song;
        songContent: { full: string; stripped: string };
    } | null = useMemo(() => {
        const s = songList.find((x) => x.id == currentSongInQueue);
        if (!s) return null;

        return {
            song: s,
            songContent: {
                full: s.content,
                stripped: s.content.replace(/(\r\n|\n|\r)/gm, ""),
            },
        };
    }, [songList, currentSongInQueue]);

    const { elements, linesCount, newLineIndexes } = useMemo(() => {
        const songLines = splitSongIntoLines(songData?.songContent.full ?? "");
        const midpoint = Math.floor(songLines.length / 2);
        const start = -midpoint;

        const angle = 10.5;
        const lineLimit = 8;
        const tempElements: ReactNode[] = [];
        const newLineIndexes: number[] = [];
        songLines.forEach((x, i) => {
            if (x == "𝆕") {
                newLineIndexes.push(i);
            }
        });

        const tempLines = [];
        for (let i = 0; i < songLines.length; i++) {
            if (
                start + i + midpoint + curr < -lineLimit ||
                start + i + midpoint + curr > lineLimit
            )
                continue;

            const transform = `rotateX(calc(${
                start + i + midpoint + curr
            }*${angle}deg))`;
            const fontSizeOffset = 10 - Math.abs(start + i + midpoint + curr);
            const fontSize = `${fontSizeOffset * 3}px`;
            const fontColourOffset =
                1 - Math.abs(start + i + midpoint + curr) * (1 / lineLimit);
            const fontColour = `rgb(255 255 255 / ${fontColourOffset})`;
            const fontWeight =
                start + i + midpoint + curr == 0 ? "bold" : "normal";

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
                    {songLines[i]}
                </div>
            );
        }

        return {
            elements: tempElements,
            linesCount: songLines.length,
            newLineIndexes: newLineIndexes,
        };
    }, [curr]);

    const scrollDivRef = useRef<HTMLDivElement>(null);

    useHotkeys("[", () => {
        changeCurrVal(-1);
    });

    const changeCurrVal = (amount: number) => {
        let newVal = curr + amount;
        if (newVal < -linesCount || newVal > 0) return;

        console.log(newLineIndexes, newVal);
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
    }, []);

    return (
        <div
            className="flex justify-center items-center w-full h-screen flex-col text-xl space-y-2 relative"
            ref={scrollDivRef}
        >
            <Progress
                value={((-curr + 1) / linesCount) * 100}
                className="absolute rotate-90 w-[5rem] left-0 opacity-60"
            />
            {elements}
            {curr}
            {/* {scrollValue} */}
        </div>
    );
}

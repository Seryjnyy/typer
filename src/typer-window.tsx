import {
    Cross1Icon,
    HamburgerMenuIcon,
    ReloadIcon,
    TrackNextIcon,
    TrackPreviousIcon,
} from "@radix-ui/react-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useStopwatch } from "react-timer-hook";
import { Button } from "./components/ui/button";
import { useQueueStore } from "./lib/store/queue-store";
import { useSongProgressStore } from "./lib/store/song-progress-store";
import { useSongStore } from "./lib/store/song-store";
import { useUiStateStore } from "./lib/store/ui-state-store";
import { calculateAccuracy, cn, round } from "./lib/utils";
import { Song } from "./lib/types";

// options
// Can split into a certain amount of lines or
// can split using verses (using "")
// can split using verses, then split by lines if needed

// display
// line by line
// verse by verse
// slide  verses, like show all text but the one your doing in the center

const QueueControlButton = ({
    song,
    controlType,
}: {
    song: Song | undefined;
    controlType: "next" | "prev";
}) => {
    return (
        <Button
            variant={"ghost"}
            className="rounded-full group"
            disabled={song == null}
        >
            {controlType == "prev" ?? <TrackPreviousIcon />}
            <div className="flex flex-col max-w-[12rem] min-w-[2rem] pl-1">
                {song != null && (
                    <div className="flex gap-2 items-center">
                        <div
                            className={cn(
                                "h-6 w-6 rounded-md",
                                song.cover
                                // "bg-gradient-to-bl from-yellow-200 to-violet-800"
                            )}
                        ></div>
                        <div className="flex flex-col">
                            <span className="text-ellipsis overflow-hidden text-sm group-hover:text-accent-foreground">
                                {song.title}
                            </span>
                            <span className="text-muted-foreground text-xs text-ellipsis overflow-hidden group-hover:text-accent-foreground">
                                {song.source}
                            </span>
                        </div>
                    </div>
                )}
            </div>
            {controlType == "next" ?? <TrackNextIcon />}
        </Button>
    );
};

const EndScreen = ({
    onRestart,
    userInputLength,
}: {
    onRestart: () => void;
    userInputLength: number;
}) => {
    const [open, setOpen] = useState(true);
    const currentSongID = useQueueStore.use.current();
    const getSongData = useSongStore.use.getSongData();

    const getNextSong = useQueueStore.use.getNextSong();
    const getPrevSong = useQueueStore.use.getPrevSong();

    // const playNextSong = useQueueStore.use.();

    const timeElapsed = useSongProgressStore.use.timeElapsed();

    const typedChars = useSongProgressStore.use.songTypedChar();

    const correct = useSongProgressStore.use.correct();

    if (!currentSongID) return <></>;

    const songData = getSongData(currentSongID);

    const prevSongID = getPrevSong();
    const prevSong = prevSongID ? getSongData(prevSongID) : undefined;

    const nextSongID = getNextSong();
    const nextSong = nextSongID ? getSongData(nextSongID) : undefined;

    // TODO : The button is currently bigger than then the container when !open
    return (
        <div
            className={cn(
                "absolute w-[78%] h-[60vh] backdrop-blur-[6px] border rounded-xl  flex justify-center right-[2%]",
                { "h-9 w-9 border-none": !open }
            )}
        >
            <div className="w-full h-full relative">
                <Button
                    className={cn(
                        "absolute right-0 top-0 rounded-l-none rounded-tr-xl",
                        open ? "rounded-br-none" : "rounded-xl border"
                    )}
                    variant={"ghost"}
                    size={"icon"}
                    onClick={() => setOpen((prev) => !prev)}
                >
                    {open ? <Cross1Icon /> : <HamburgerMenuIcon />}
                </Button>
                {open && (
                    <div className="flex flex-col  justify-between items-center h-full p-8 ">
                        <div className="text-center">
                            <h2 className="text-2xl">{songData?.title}</h2>
                            <span className="text-muted-foreground text-md">
                                {songData?.source}
                            </span>
                        </div>
                        <div className=" flex gap-12">
                            <div className="flex flex-col">
                                <span className="text-muted-foreground text-xl">
                                    chpm
                                </span>
                                <span className="text-accent text-3xl">
                                    {timeElapsed == 0
                                        ? userInputLength
                                        : round(
                                              userInputLength /
                                                  (timeElapsed / 60)
                                          )}
                                </span>
                            </div>

                            <div className="flex flex-col">
                                <span className="text-muted-foreground text-xl">
                                    acc
                                </span>
                                <span className="text-accent text-3xl">
                                    {calculateAccuracy(
                                        correct,
                                        userInputLength
                                    )}
                                    %
                                </span>
                            </div>

                            <div className="flex flex-col">
                                <span className="text-muted-foreground text-xl">
                                    ch
                                </span>
                                <span className="text-accent text-3xl">
                                    {typedChars}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-muted-foreground text-xl">
                                    s
                                </span>
                                <span className="text-accent text-3xl">
                                    {timeElapsed}
                                </span>
                            </div>
                        </div>
                        <div className="w-full flex justify-between ">
                            <QueueControlButton
                                song={prevSong}
                                controlType="prev"
                            />

                            <Button
                                variant={"ghost"}
                                size={"icon"}
                                onClick={onRestart}
                            >
                                <ReloadIcon />
                            </Button>

                            <Button
                                variant={"ghost"}
                                className="rounded-full group flex gap-1 items-center"
                                disabled={nextSong == null}
                            >
                                <div className="flex flex-col max-w-[12rem] min-w-[2rem] pl-1">
                                    {nextSong != null && (
                                        <div className="flex gap-2 items-center">
                                            <div
                                                className={cn(
                                                    "h-6 w-6 rounded-md",
                                                    nextSong.cover
                                                    // "bg-gradient-to-bl from-yellow-200 to-violet-800"
                                                )}
                                            ></div>
                                            <div className="flex flex-col items-start">
                                                <span className="text-ellipsis overflow-hidden text-sm group-hover:text-accent-foreground">
                                                    {nextSong.title}
                                                </span>
                                                <span className="text-muted-foreground text-xs text-ellipsis overflow-hidden group-hover:text-accent-foreground">
                                                    {nextSong.source}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <TrackNextIcon />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function TyperWindow() {
    const queueWindowOpen = useUiStateStore.use.queueWindowOpen();
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
        resetStopwatch();
        pauseStopwatch();
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
            pauseStopwatch();
            if (queue.autoplay) {
                queue.next();
            }
            setUserInput(input);
        } else {
            setUserInput(input);
        }
    };

    const { element, startOfLineIndexes, startOfLineRefs, correct, incorrect } =
        useMemo(() => {
            if (song == undefined) {
                return {
                    element: <></>,
                    startOfLineIndexes: [],
                    startOfLineRefs: [],
                    correct: 0,
                    incorrect: 0,
                };
            }

            const split = song?.content.split(/\r?\n/);
            let lineCounter = 0;
            let charIndex = 0;
            let startOfLineIndexes: number[] = [];
            let startOfLineRefs: Record<number, HTMLDivElement> = {};

            let correct = 0;
            let incorrect = 0;

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

    useEffect(() => {
        songProgress.setCorrect(correct);
        songProgress.setIncorrect(incorrect);
    }, [correct, incorrect]);

    const onRestart = () => {
        songProgress.setCompleted(false);
        // songProgress.setCorrect(0)
        // songProgress.setIncorrect(0)
        songProgress.setSongTypedChar(0);
        songProgress.setStarted(false);
        songProgress.setTimeElapsed(0);

        setUserInput("");

        resetStopwatch();
        pauseStopwatch();
    };

    console.log("rerender");

    return (
        <div className="flex justify-start">
            <div className="w-[18rem]  h-[92%] border-r flex flex-col pt-12 px-2 ">
                <Button variant={"ghost"} size={"icon"} onClick={onRestart}>
                    <ReloadIcon />
                </Button>
                <span>{queue.autoplay ? "autoplay" : "not-autoplay"}</span>
                <div>
                    {`correct ${songProgress.correct} incorrect ${
                        songProgress.incorrect
                    } percentage ${calculateAccuracy(
                        songProgress.correct,
                        userInput.length
                    )} 
                    ${songProgress.completed ? "completed" : "not-completed"}
                    `}
                    {}
                </div>
                <div className="flex flex-col gap-2 pt-8">
                    <div>{`song length: ${song?.content.length}`}</div>
                    <div>{`userInput length: ${userInput.length}`}</div>
                </div>
                {/* <div>
                    <div>Best completions</div>
                    <div>Best times</div>
                    <div>times attempted</div>
                </div> */}
            </div>

            <div className="flex justify-center w-full pt-24  ">
                <div className={queueWindowOpen ? "" : "pr-[15.8rem]"}>
                    {element}
                </div>
                {!queue.autoplay && songProgress.completed && (
                    <EndScreen
                        onRestart={onRestart}
                        userInputLength={userInput.length}
                    />
                )}

                <textarea
                    value={userInput}
                    onChange={(e) => onUserInput(e.target.value)}
                    placeholder="what"
                    className=" border opacity-0 fixed w-0 h-0  "
                    ref={inputRef}
                    disabled={songProgress.completed}
                />
            </div>
        </div>
    );
}

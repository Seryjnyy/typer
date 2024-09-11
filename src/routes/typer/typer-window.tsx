import {
    CheckIcon,
    Cross1Icon,
    DividerVerticalIcon,
    HamburgerMenuIcon,
    ReloadIcon,
    TrackNextIcon,
    TrackPreviousIcon,
} from "@radix-ui/react-icons";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useStopwatch } from "react-timer-hook";
import { Button } from "./components/ui/button";
import { useQueueStore } from "./lib/store/queue-store";
import { useSongProgressStore } from "./lib/store/song-progress-store";
import { useSongStore } from "./lib/store/song-store";
import { useUiStateStore } from "./lib/store/ui-state-store";
import { calculateAccuracy, chpm, cn, round } from "./lib/utils";
import { Song } from "./lib/types";
import { start } from "repl";
import { ScrollArea } from "./components/ui/scroll-area";
import Ch, { chVariant, chVariants } from "./components/ch";
import { useNavigate } from "react-router";
import { convertSongToElements } from "./routes/typer/verse/utils";

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
            {controlType == "prev" ? <TrackPreviousIcon /> : <></>}
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
            {controlType == "next" ? <TrackNextIcon /> : <></>}
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
                                        : chpm(userInputLength, timeElapsed)}
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

                            <QueueControlButton
                                song={nextSong}
                                controlType="next"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const Stat = ({
    title,
    stat,
}: {
    title: string;
    stat: string | number | boolean;
}) => {
    let statText = stat;

    if (typeof stat === "boolean") {
        statText = stat ? "true" : "false";
    }

    return (
        <div className="flex justify-between">
            <span>{title}</span>
            <span className="text-muted-foreground">{statText}</span>
        </div>
    );
};

export default function TyperWindow() {
    const [focusedOnInput, setFocusedOnInput] = useState(false);
    const queueWindowOpen = useUiStateStore.use.queueWindowOpen();
    const queue = useQueueStore();
    const songList = useSongStore.use.songs();
    const [song, songContentNoNewLine] = useMemo(() => {
        const s = songList.find((x) => x.id == queue.current);
        if (!s) return [undefined, undefined];

        return [s, s.content.replace(/(\r\n|\n|\r)/gm, "")];
    }, [songList, queue.current]);
    const songProgress = useSongProgressStore();

    const inputRef = useRef<HTMLTextAreaElement>(null);
    const {
        totalSeconds,
        start: startStopwatch,
        pause: pauseStopwatch,
        reset: resetStopwatch,
    } = useStopwatch({
        autoStart: false,
    });
    const resetProgressState = useSongProgressStore.use.resetState();
    const userInput = useSongProgressStore.use.userInput();
    const setUserInput = useSongProgressStore.use.setUserInput();

    useEffect(() => {
        resetProgressState();
        console.log("reseting state and stopwatch");

        // pauseStopwatch();
        resetStopwatch(undefined, false);
        songProgress.setSongTotalChar(
            songContentNoNewLine != undefined ? songContentNoNewLine.length : 0
        );
        console.log(song);
    }, [song]);

    useHotkeys("*", (k, handler) => {
        // focus
        inputRef.current?.focus();

        if (song != undefined && !songProgress.completed) {
            inputRef.current?.focus();
            startStopwatch();
            // uiState.setFocus(true);
        }
    });

    const navigate = useNavigate();

    const { element, startOfLineIndexes, startOfLineRefs, correct, incorrect } =
        useMemo(
            () =>
                convertSongToElements(
                    song?.content ?? "",
                    userInput,
                    (verse: string) => {
                        navigate("/verse", { state: { content: verse } });
                    }
                ),
            [song, userInput]
        );

    useEffect(() => {
        songProgress.setCorrect(correct);
        songProgress.setIncorrect(incorrect);
    }, [correct, incorrect]);

    useEffect(() => {
        songProgress.setTimeElapsed(totalSeconds);
    }, [totalSeconds]);

    const onUserInput = (input: string) => {
        setUserInput(input);

        const finished = input.length == songContentNoNewLine?.length;
        if (finished) {
            songProgress.setCompleted(true);
            pauseStopwatch();
            if (queue.autoplay) {
                queue.next();
            }
        }

        songProgress.setSongTypedChar(input.length);

        // Check if user is on the start of a line, if so get the index
        const currentLineIndex = startOfLineIndexes.findIndex(
            (x) => x == userInput.length
        );

        // console.log("🚀 ~ onUserInput ~ currentLineIndex:", currentLineIndex);

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

    const onRestart = () => {
        resetProgressState();

        // pauseStopwatch();
        resetStopwatch(undefined, false);
    };

    // console.log("rerender");

    return (
        <div className="relative h-full w-full overflow-y-hidden">
            <ScrollArea className="h-full  relative">
                <div className="w-full h-full ">
                    <div className="flex justify-start">
                        <div className="w-[18rem]  h-[92%]  border-r flex flex-col pt-12 px-2 ">
                            <Stat title="focused" stat={focusedOnInput} />
                            <Stat title="correct" stat={songProgress.correct} />
                            <Stat
                                title="incorrect"
                                stat={songProgress.incorrect}
                            />
                            <Stat
                                title="correct%"
                                stat={calculateAccuracy(
                                    songProgress.correct,
                                    userInput.length
                                )}
                            />

                            <Stat
                                title="time"
                                stat={songProgress.timeElapsed + "s"}
                            />
                            <Stat
                                title="chpm"
                                stat={
                                    songProgress.timeElapsed == 0
                                        ? songProgress.userInput.length
                                        : chpm(
                                              songProgress.userInput.length,
                                              songProgress.timeElapsed
                                          )
                                }
                            />
                            <Stat
                                title="completed"
                                stat={songProgress.completed}
                            />
                            <Stat
                                title="song-len"
                                stat={songContentNoNewLine?.length ?? 0}
                            />
                            <Stat
                                title="completion"
                                stat={`${songProgress.songTypedChar}/${songProgress.songTotalChar}`}
                            />
                            <Stat
                                title="user-input-len"
                                stat={userInput.length ?? 0}
                            />
                            <Stat title="autoplay" stat={queue.autoplay} />

                            <div className="flex flex-col gap-2 pt-4">
                                <Button
                                    variant={"secondary"}
                                    onClick={onRestart}
                                >
                                    reset song progress
                                </Button>
                                <Button
                                    onClick={resetProgressState}
                                    variant={"secondary"}
                                >
                                    reset progress state
                                </Button>
                            </div>

                            {/* <div>
                    <div>Best completions</div>
                    <div>Best times</div>
                    <div>times attempted</div>
                </div> */}
                        </div>

                        <div className="flex justify-center w-full py-24 ">
                            <div
                                className={
                                    queueWindowOpen ? "" : "pr-[15.5rem]"
                                }
                            >
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
                                onFocus={() => setFocusedOnInput(true)}
                                onBlur={() => setFocusedOnInput(false)}
                            />
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}

import { useQueueStore } from "@/lib/store/queue-store";
import { useSongProgressStore } from "@/lib/store/song-progress-store";
import { useSongStore } from "@/lib/store/song-store";
import {
    Cross1Icon,
    HamburgerMenuIcon,
    ReloadIcon,
    TrackNextIcon,
    TrackPreviousIcon,
} from "@radix-ui/react-icons";
import { ReactNode, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStopwatch } from "react-timer-hook";
import { Button } from "@/components/ui/button";
import { calculateAccuracy, chpm, cn } from "@/lib/utils";
import Typing, { Handlers, ProgressManager, SongData } from "./typing";
import { Song } from "@/lib/types";
import { useUiStateStore } from "@/lib/store/ui-state-store";

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

const Stats = ({ children }: { children?: ReactNode }) => {
    const autoplay = useQueueStore.use.autoplay();
    const correct = useSongProgressStore.use.correct();
    const incorrect = useSongProgressStore.use.incorrect();
    const userInput = useSongProgressStore.use.userInput();
    const completed = useSongProgressStore.use.completed();
    const timeElapsed = useSongProgressStore.use.timeElapsed();
    const totalChar = useSongProgressStore.use.songTotalChar();
    const typedChar = useSongProgressStore.use.songTypedChar();
    const resetProgressState = useSongProgressStore.use.resetState();

    const songList = useSongStore.use.songs();
    const currentSongInQueue = useQueueStore.use.current();

    const songStripped = useMemo(() => {
        const s = songList.find((x) => x.id == currentSongInQueue);
        if (!s) return "";

        return s.content.replace(/(\r\n|\n|\r)/gm, "");
    }, [currentSongInQueue]);

    return (
        <div className="w-[18rem]  h-[92%]  border-r flex flex-col pt-12 px-2 ">
            {/* <Stat title="focused" stat={focusedOnInput} /> */}
            <Stat title="correct" stat={correct} />
            <Stat title="incorrect" stat={incorrect} />
            <Stat
                title="correct%"
                stat={calculateAccuracy(correct, userInput.length)}
            />

            <Stat title="time" stat={timeElapsed + "s"} />
            <Stat
                title="chpm"
                stat={
                    timeElapsed == 0
                        ? userInput.length
                        : chpm(userInput.length, timeElapsed)
                }
            />
            <Stat title="completed" stat={completed} />
            <Stat title="song-len" stat={songStripped?.length ?? 0} />
            <Stat title="completion" stat={`${typedChar}/${totalChar}`} />
            <Stat title="user-input-len" stat={userInput.length ?? 0} />
            <Stat title="autoplay" stat={autoplay} />

            <div className="flex flex-col gap-2 pt-4">
                {children}
                <Button onClick={resetProgressState} variant={"secondary"}>
                    reset progress state
                </Button>
            </div>

            {/* <div>
<div>Best completions</div>
<div>Best times</div>
<div>times attempted</div>
</div> */}
        </div>
    );
};

export default function TyperTestPage() {
    const currentSongInQueue = useQueueStore.use.current();
    const songList = useSongStore.use.songs();

    const completed = useSongProgressStore.use.completed();
    const setCompleted = useSongProgressStore.use.setCompleted();

    const setCorrect = useSongProgressStore.use.setCorrect();
    const setIncorrect = useSongProgressStore.use.setIncorrect();

    const userInput = useSongProgressStore.use.userInput();
    const setUserInput = useSongProgressStore.use.setUserInput();

    const setTargetChar = useSongProgressStore.use.setSongTotalChar();
    const setTypedCharCount = useSongProgressStore.use.setSongTypedChar();
    const resetProgressState = useSongProgressStore.use.resetState();

    const autoplay = useQueueStore.use.autoplay();
    const next = useQueueStore.use.next();

    const queueWindowOpen = useUiStateStore.use.queueWindowOpen();

    const {
        totalSeconds,
        start: startStopwatch,
        pause: pauseStopwatch,
        reset: resetStopwatch,
    } = useStopwatch({
        autoStart: false,
    });

    const songData: SongData = useMemo(() => {
        const s = songList.find((x) => x.id == currentSongInQueue);
        if (!s) return { song: "", songStripped: "" };

        return {
            song: s.content,
            songStripped: s.content.replace(/(\r\n|\n|\r)/gm, ""),
        };
    }, [songList, currentSongInQueue]);

    const progressManager: ProgressManager = {
        userInput: userInput,
        completed: completed,
        setCompleted: setCompleted,
        setCorrect: setCorrect,
        setIncorrect: setIncorrect,
        setUserInput: setUserInput,
        setTargetCharCount: setTargetChar,
        setTypedCharCount: setTypedCharCount,
        restartState: resetProgressState,
    };

    const navigate = useNavigate();

    const handlers: Handlers = {
        onStart: () => {
            startStopwatch();
        },
        onChangeSong: () => {
            resetProgressState();
            resetStopwatch(undefined, false);
        },
        onFinish: () => {
            pauseStopwatch();
            if (autoplay) {
                next();
            }
        },
        onClickVerse: (verse: string) => {
            navigate("/verse", { state: { content: verse } });
        },
    };

    const onRestart = () => {
        resetProgressState();
        resetStopwatch(undefined, false);
    };

    return (
        <div
            className={cn("h-full flex", queueWindowOpen ? "" : "pr-[15.5rem]")}
        >
            <Stats>
                {
                    <Button variant={"secondary"} onClick={onRestart}>
                        reset song progress
                    </Button>
                }
            </Stats>
            <Typing
                songData={songData}
                progressManager={progressManager}
                handlers={handlers}
                tryVerseOption={true}
            >
                {!autoplay && completed && (
                    <EndScreen
                        onRestart={onRestart}
                        userInputLength={userInput.length}
                    />
                )}
            </Typing>
        </div>
    );
}

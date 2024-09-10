import { useQueueStore } from "@/lib/store/queue-store";
import { useSongProgressStore } from "@/lib/store/song-progress-store";
import { useSongStore } from "@/lib/store/song-store";
import {
    Cross1Icon,
    HamburgerMenuIcon,
    PlusIcon,
    ReloadIcon,
    TrackNextIcon,
    TrackPreviousIcon,
} from "@radix-ui/react-icons";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStopwatch } from "react-timer-hook";
import { Button } from "@/components/ui/button";
import { calculateAccuracy, chpm, cn, shuffleArray } from "@/lib/utils";
import Typing, { Handlers, ProgressManager, SongData } from "./typing";
import { Song } from "@/lib/types";
import { useUiStateStore } from "@/lib/store/ui-state-store";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import Stat from "./stat";
import EndScreen from "./end-screen";
import BackButton from "@/components/ui/back-button";
import { Progress } from "@/components/ui/progress";
import SongCarousel from "@/components/song-carousel";

const Stats = ({
    onRestart,
    children,
    className,
}: {
    onRestart: () => void;
    className?: string;
    children?: ReactNode;
}) => {
    const correct = useSongProgressStore.use.correct();
    const incorrect = useSongProgressStore.use.incorrect();
    const userInput = useSongProgressStore.use.userInput();
    const completed = useSongProgressStore.use.completed();
    const timeElapsed = useSongProgressStore.use.timeElapsed();
    const totalChar = useSongProgressStore.use.songTotalChar();

    return (
        <div
            className={cn(
                "  border-r flex flex-col  w-[15rem] pt-[8.3rem]",
                className
            )}
        >
            <div className="mx-2 space-y-4">
                <div className="border rounded-md  p-2">
                    <Stat title="time" stat={timeElapsed} append="s" />
                    <Stat
                        title="chpm"
                        stat={
                            timeElapsed == 0
                                ? userInput.length
                                : chpm(userInput.length, timeElapsed)
                        }
                    />
                    <Stat
                        title="accuracy"
                        stat={calculateAccuracy(correct, userInput.length)}
                        append="%"
                    />
                    <Stat
                        title="ch"
                        stat={`${userInput.length}/${totalChar}`}
                    />
                </div>
                <Button
                    className="w-full"
                    variant={"outline"}
                    onClick={onRestart}
                >
                    <ReloadIcon />
                </Button>
                <div className="space-y-1">
                    <Progress value={(userInput.length / totalChar) * 100} />
                    {completed && (
                        <div className="text-primary flex justify-center text-xs uppercase opacity-80">
                            <span>complete</span>
                        </div>
                    )}
                </div>

                <div className="border rounded-md  p-2">
                    <Stat title="correct" stat={correct} />
                    <Stat title="incorrect" stat={incorrect} />
                    {/* <Stat title="focused" stat={focusedOnInput} /> */}
                </div>
            </div>

            <div className="flex flex-col gap-2 pt-4">{children}</div>
        </div>
    );
};

const NoSongSelected = () => {
    const songs = useSongStore.use.songs();
    const isQueueWindowOpen = useUiStateStore.use.queueWindowOpen();

    const shortened = useMemo(() => {
        const shuffled = shuffleArray(songs);
        return shuffled.slice(0, Math.min(shuffled.length, 10));
    }, [songs]);

    console.log(shortened.length);

    return (
        <div
            className={cn(
                "flex h-[calc(100vh-4rem)] w-full items-center pt-12 flex-col ",
                isQueueWindowOpen ? "" : "pl-[15rem]"
            )}
        >
            <h2 className="font-bold text-3xl">No song selected.</h2>
            <div className="flex flex-col justify-center items-center pt-16">
                {songs.length > 0 && (
                    <div className="space-y-1">
                        <h3 className=" text-muted-foreground mx-auto w-fit text-md">
                            Here are some of your songs.
                        </h3>

                        <SongCarousel songs={shortened} />
                    </div>
                )}
                {songs.length > 0 && (
                    <div className="font-bold text-muted-foreground py-8">
                        or
                    </div>
                )}
                <div className="flex flex-col gap-3">
                    {songs.length == 0 && (
                        <div className="flex flex-col justify-center items-center">
                            <span className="text-sm text-muted-foreground">
                                Seems like you don't have any songs yet :/
                            </span>
                            <span className="text-sm text-muted-foreground">
                                No worries you can add some.
                            </span>
                        </div>
                    )}
                    <Button className="space-x-2" variant={"secondary"}>
                        <PlusIcon />
                        <span>Add new song</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default function TyperTestPage() {
    const currentSongInQueue = useQueueStore.use.current();
    const songList = useSongStore.use.songs();

    const completed = useSongProgressStore.use.completed();
    const setCompleted = useSongProgressStore.use.setCompleted();

    const setCorrect = useSongProgressStore.use.setCorrect();
    const correct = useSongProgressStore.use.correct();
    const setIncorrect = useSongProgressStore.use.setIncorrect();

    const userInput = useSongProgressStore.use.userInput();
    const setUserInput = useSongProgressStore.use.setUserInput();

    const setTargetChar = useSongProgressStore.use.setSongTotalChar();
    const setTypedCharCount = useSongProgressStore.use.setSongTypedChar();
    const resetProgressState = useSongProgressStore.use.resetState();

    const timeElapsed = useSongProgressStore.use.timeElapsed();
    const setTimeElapsed = useSongProgressStore.use.setTimeElapsed();

    const autoplay = useQueueStore.use.autoplay();
    const next = useQueueStore.use.next();

    const queueWindowOpen = useUiStateStore.use.queueWindowOpen();

    const editSongCompletion = useSongStore.use.editSongCompletion();
    const editSongRecord = useSongStore.use.editSongRecord();

    const {
        totalSeconds,
        start: startStopwatch,
        pause: pauseStopwatch,
        reset: resetStopwatch,
    } = useStopwatch({
        autoStart: false,
    });

    const { song, songData }: { song: Song | null; songData: SongData } =
        useMemo(() => {
            const s = songList.find((x) => x.id == currentSongInQueue);
            if (!s)
                return { song: null, songData: { song: "", songStripped: "" } };

            return {
                song: s,
                songData: {
                    song: s.content,
                    songStripped: s.content.replace(/(\r\n|\n|\r)/gm, ""),
                },
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

            if (!song) return;

            editSongCompletion(song.id, song.completion + 1);

            const resultChpm =
                timeElapsed == 0
                    ? userInput.length
                    : chpm(userInput.length, timeElapsed);

            const resultAcc = calculateAccuracy(correct, userInput.length);
            if (
                resultChpm > song.record.chpm ||
                (resultChpm == song.record.chpm &&
                    resultAcc > song.record.accuracy)
            ) {
                // TODO : Set song record
                editSongRecord(song.id, {
                    chpm: resultChpm,
                    accuracy: resultAcc,
                });
            }
        },
        onClickVerse: (verse: string) => {
            navigate("/verse", {
                state: { content: verse, id: song?.id ?? "" },
            });
        },
    };

    const onRestart = () => {
        resetProgressState();
        resetStopwatch(undefined, false);
    };

    useEffect(() => {
        setTimeElapsed(totalSeconds);
    }, [totalSeconds]);

    return (
        <div className={cn("h-full flex", queueWindowOpen ? "" : "pr-[15rem]")}>
            {song != null && (
                <Stats
                    onRestart={onRestart}
                    // className={song == null ? "invisible" : "visible"}
                >
                    {/* {
                    <Button variant={"secondary"} onClick={onRestart}>
                        reset song progress
                    </Button>
                } */}
                </Stats>
            )}
            {song != null && (
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
            )}

            {song == null && <NoSongSelected />}
        </div>
    );
}

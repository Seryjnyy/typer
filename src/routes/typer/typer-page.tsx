import { Button } from "@/components/ui/button";
import { useQueueStore } from "@/lib/store/queue-store";
import { useSongProgressStore } from "@/lib/store/song-progress-store";
import { useSongStore } from "@/lib/store/song-store";
import { useUiStateStore } from "@/lib/store/ui-state-store";
import { Song } from "@/lib/types";
import {
    calculateAccuracy,
    chpm,
    cn,
    textModification,
    wpm,
} from "@/lib/utils";

import { ReloadIcon } from "@radix-ui/react-icons";
import { ReactNode, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useStopwatch } from "react-timer-hook";
import EndScreen from "./end-screen";

import CylinderTyper from "./cylinder-typer";

import { Progress } from "@/components/ui/progress";
import { usePreferenceStore } from "@/lib/store/preferences-store";
import { useTextModificationsStore } from "@/lib/store/text-modifications-store";
import TextModificationDialog from "./cylinder/text-modification-dialog";
import FlatTyper from "./flat-typer";
import NoSongSelected from "./no-song-selected";
import Stat from "./stat";
import { Handlers, ProgressManager } from "./types";

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

export default function TyperPage() {
    const currentSongInQueue = useQueueStore.use.current();
    const songList = useSongStore.use.songs();

    const completed = useSongProgressStore.use.completed();
    const setCompleted = useSongProgressStore.use.setCompleted();

    const setCorrect = useSongProgressStore.use.setCorrect();
    const correct = useSongProgressStore.use.correct();
    const setIncorrect = useSongProgressStore.use.setIncorrect();
    const errorMap = useSongProgressStore.use.errorMap();
    const recordError = useSongProgressStore.use.recordError();

    const userInput = useSongProgressStore.use.userInput();
    const setUserInput = useSongProgressStore.use.setUserInput();

    const setTargetChar = useSongProgressStore.use.setSongTotalChar();
    const setTypedCharCount = useSongProgressStore.use.setSongTypedChar();
    const resetProgressState = useSongProgressStore.use.resetState();

    const timeElapsed = useSongProgressStore.use.timeElapsed();
    const setTimeElapsed = useSongProgressStore.use.setTimeElapsed();
    const started = useSongProgressStore.use.started();
    const setStarted = useSongProgressStore.use.setStarted();

    const autoplay = useQueueStore.use.autoplay();
    const next = useQueueStore.use.next();

    const queueWindowOpen = useUiStateStore.use.queueWindowOpen();

    const editSongCompletion = useSongStore.use.editSongCompletion();
    const editSongRecord = useSongStore.use.editSongRecord();

    const txtMods = useTextModificationsStore.use.textModifications();
    const difficultyModifiers = useTextModificationsStore.use.harderOptions();
    const typerTextDisplay = usePreferenceStore.use.typerTextDisplay();

    const {
        totalSeconds,
        start: startStopwatch,
        pause: pauseStopwatch,
        reset: resetStopwatch,
    } = useStopwatch({
        autoStart: false,
    });

    const songData: {
        song: Song;
        content: { full: string; stripped: string };
    } | null = useMemo(() => {
        const s = songList.find((x) => x.id == currentSongInQueue);
        if (!s) return null;

        let txt = textModification(s.content, txtMods);

        return {
            song: s,
            content: {
                full: txt,
                stripped: txt.replace(/(\r\n|\n|\r)/gm, ""),
            },
        };
    }, [songList, currentSongInQueue, txtMods]);

    const progressManager: ProgressManager = {
        started: started,
        userInput: userInput,
        completed: completed,
        errorMap: errorMap,
        timeElapsed,
        recordError: recordError,
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
        onRestart: () => onRestart(),
        onStart: () => {
            startStopwatch();
            setStarted(true);
        },
        onChangeSong: () => {
            resetProgressState();
            resetStopwatch(undefined, false);
        },
        onFinish: () => {
            pauseStopwatch();
            if (autoplay) {
                setTimeout(() => next(), 2000);
            }
            if (!songData) return;
            editSongCompletion(songData.song.id, songData.song.completion + 1);

            // Change time elapsed to 1 if it's 0 because we don't have milliseconds
            if (timeElapsed == 0) {
                setTimeElapsed(1);
            }

            const resultWpm = wpm(
                userInput.length,
                timeElapsed == 0 ? 1 : timeElapsed
            );

            const resultAcc = calculateAccuracy(correct, userInput.length);
            if (
                resultWpm > songData.song.record.wpm ||
                (resultWpm == songData.song.record.wpm &&
                    resultAcc > songData.song.record.accuracy)
            ) {
                // Only save if text wasn't made easier.
                if (
                    txtMods.letterCase == "normal" &&
                    txtMods.numbers == "normal" &&
                    txtMods.punctuation == "normal"
                ) {
                    editSongRecord(songData.song.id, {
                        wpm: resultWpm,
                        accuracy: resultAcc,
                    });
                }
            }
        },
        onClickVerse: (verse: string) => {
            navigate("/verse", {
                state: {
                    content: verse,
                    id: songData?.song.id ?? "",
                    cameFrom: `/`,
                },
            });
        },
    };

    const onRestart = () => {
        resetProgressState();
        resetStopwatch(undefined, false);
    };

    useEffect(() => {
        setTimeElapsed(totalSeconds);

        console.log(
            "WPM",
            totalSeconds > 0 ? wpm(userInput.length, totalSeconds) : 0
        );
    }, [totalSeconds]);

    return (
        <div
            className={cn("h-[calc(100vh-4rem)] w-full flex overflow-hidden ")}
        >
            {songData == null && <NoSongSelected />}
            {songData != null && typerTextDisplay == "cylinder" && (
                <CylinderTyper
                    songData={songData}
                    progressManager={progressManager}
                    handlers={handlers}
                    tryVerseOption={true}
                    difficultyModifiers={difficultyModifiers}
                >
                    {!autoplay && completed && (
                        <EndScreen
                            onRestart={onRestart}
                            userInputLength={userInput.length}
                        />
                    )}
                </CylinderTyper>
            )}
            {songData != null && typerTextDisplay == "flat" && (
                <div className="w-full pb-4">
                    <FlatTyper
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
                    </FlatTyper>
                </div>
            )}
        </div>
    );
}

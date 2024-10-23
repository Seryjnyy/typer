import { useQueueStore } from "@/lib/store/queue-store";
import { useSongProgressStore } from "@/lib/store/song-progress-store";
import { useSongStore } from "@/lib/store/song-store";
import { useUiStateStore } from "@/lib/store/ui-state-store";
import { Song } from "@/lib/types";
import { calculateAccuracy, cn, textModification, wpm } from "@/lib/utils";

import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useStopwatch } from "react-timer-hook";
import EndScreen from "./end-screen";

import CylinderTyper from "./cylinder-typer";

import { usePreferenceStore } from "@/lib/store/preferences-store";
import { useTextModificationsStore } from "@/lib/store/text-modifications-store";
import FlatTyper from "./flat-typer";
import NoSongSelected from "./no-song-selected";
import { Handlers, ProgressManager } from "./types";

export default function TyperPage() {
    const currentSongInQueue = useQueueStore.use.current();
    const songList = useSongStore.use.songs();

    const completed = useSongProgressStore.use.completed();
    const setCompleted = useSongProgressStore.use.setCompleted();

    const setCorrect = useSongProgressStore.use.setCorrect();
    const correct = useSongProgressStore.use.correct();
    const songTypedChars = useSongProgressStore.use.songTypedChar();

    const incorrect = useSongProgressStore.use.incorrect();
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

    const isOpenEndScreenInitially =
        usePreferenceStore.use.isOpenEndScreenInitially();

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
        typedChars: songTypedChars,
        correct: correct,
        incorrect: incorrect,
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

        // console.log(
        //     "WPM",
        //     totalSeconds > 0 ? wpm(userInput.length, totalSeconds) : 0
        // );
    }, [totalSeconds]);

    const endScreen =
        songData && !autoplay && completed ? (
            <EndScreen
                isTxtModificationsOn={
                    txtMods.letterCase != "normal" ||
                    txtMods.numbers != "normal" ||
                    txtMods.punctuation != "normal"
                }
                initialValue={isOpenEndScreenInitially}
                song={songData.song}
                stats={{
                    errorMap: progressManager.errorMap,
                    timeElapsed: progressManager.timeElapsed,
                    typedChars: progressManager.typedChars,
                    correct: progressManager.correct,
                    incorrect: progressManager.incorrect,
                }}
                onRestart={onRestart}
                userInputLength={userInput.length}
            />
        ) : null;

    return (
        <div
            className={cn(
                "h-[calc(100vh-5rem)] w-full flex overflow-hidden rounded-md  "
            )}
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
                    {endScreen}
                </CylinderTyper>
            )}
            {songData != null && typerTextDisplay == "flat" && (
                <div className="w-full  backdrop-brightness-50">
                    <FlatTyper
                        songData={songData}
                        progressManager={progressManager}
                        handlers={handlers}
                        tryVerseOption={true}
                        difficultyModifiers={difficultyModifiers}
                    >
                        {endScreen}
                    </FlatTyper>
                </div>
            )}
        </div>
    );
}

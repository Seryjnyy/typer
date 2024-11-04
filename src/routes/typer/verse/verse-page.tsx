import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    SongBanner,
    SongDetail,
    SongHeader,
} from "@/components/ui/song-header";
import { useUiStateStore } from "@/lib/store/ui-state-store";
import { calculateAccuracy, chpm, cn, textModification } from "@/lib/utils";
import { ArrowLeftIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { useStopwatch } from "react-timer-hook";
import Stat from "../stat";

import { useSongStore } from "@/lib/store/song-store";
import BackButton from "@/components/ui/back-button";
import FlatTyper from "../flat-typer";
import { Handlers, ProgressManager, SongData } from "../types";
import CylinderTyper from "../cylinder-typer";
import { usePreferenceStore } from "@/lib/store/preferences-store";
import { useTextModificationsStore } from "@/lib/store/text-modifications-store";
import EndScreen from "../end-screen";
import { Song } from "@/lib/types";

const SomethingWentWrong = () => {
    return (
        <div className="flex justify-center items-center h-full flex-col gap-12">
            <div className="text-center">
                <h1 className="text-xl font-semibold">
                    Sorry something went wrong.
                </h1>
                <p>Please go back and try again.</p>
            </div>
            <BackButton link="/" />
        </div>
    );
};

interface TopProps {
    cameFrom: string;
    song?: Song;
}
const Top = ({ song, cameFrom }: TopProps) => {
    return (
        <div className="absolute top-0 left-0 text-xs z-40 flex items-center gap-2 text-muted-foreground">
            <Link to={cameFrom != null ? cameFrom : "/"}>
                <Button
                    size={"sm"}
                    className="group rounded-none sm:rounded-tl-md "
                    variant={"ghost"}
                >
                    <span className="flex gap-1 backdrop-blur-sm px-1 rounded-sm">
                        <ArrowLeftIcon className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back</span>
                    </span>
                </Button>
            </Link>
            <div className="flex gap-1 backdrop-blur-sm rounded-sm pr-1">
                {song && (
                    <SongBanner
                        song={song}
                        size={"sm"}
                        className="rounded-[2px]"
                    />
                )}
                <span className="overflow-hidden text-nowrap text-ellipsis max-w-[5rem] sm:max-w-[15rem]">
                    {song?.title}
                </span>
                <span>-</span>
                <span className="overflow-hidden text-nowrap text-ellipsis max-w-[5rem] sm:max-w-[15rem] opacity-70">
                    {song?.source}
                </span>
            </div>
        </div>
    );
};

export default function VersePage() {
    const queueWindowOpen = useUiStateStore.use.queueWindowOpen();
    const songList = useSongStore.use.songs();
    const verseTyperTextDisplay =
        usePreferenceStore.use.verseTyperTextDisplay();

    const isOpenEndScreenInitiallyVersePage =
        usePreferenceStore.use.isOpenEndScreenInitiallyVersePage();
    const difficultyModifiers = useTextModificationsStore.use.harderOptions();
    const textModifications = useTextModificationsStore.use.textModifications();

    const [userInput, setUserInput] = useState("");
    const [completed, setCompleted] = useState(false);
    const [correct, setCorrect] = useState(0);
    const [incorrect, setIncorrect] = useState(0);
    const [errorMap, setErrorMap] = useState(new Map<number, number>());
    const [started, setStarted] = useState(false);

    const { state } = useLocation();

    if (!state) {
        return <SomethingWentWrong />;
    }
    const { content, id, cameFrom } = state;

    const song = useMemo(() => {
        return songList.find((x) => x.id == id);
    }, [songList, id]);

    if (!song || !content || !id || typeof content != "string") {
        return <SomethingWentWrong />;
    }

    const songData: SongData = useMemo(() => {
        if (!content) return null;

        let txt = textModification(content, textModifications);

        return {
            song: song,
            content: {
                full: txt,
                stripped: txt.replace(/(\r\n|\n|\r)/gm, ""),
            },
        };
    }, [content, difficultyModifiers, textModifications]);

    const {
        totalSeconds,
        start: startStopwatch,
        pause: pauseStopwatch,
        reset: resetStopwatch,
    } = useStopwatch({
        autoStart: false,
    });

    const restartProgressState = () => {
        setUserInput("");
        setCompleted(false);
        setCorrect(0);
        setIncorrect(0);
    };

    const recordError = (index: number) => {
        const newMap = new Map<number, number>(errorMap);

        newMap.set(index, (newMap.get(index) ?? 0) + 1);
        setErrorMap(newMap);
    };

    const progressManager: ProgressManager = {
        correct: correct,
        incorrect: incorrect,
        typedChars: userInput.length,
        started: started,
        userInput: userInput,
        completed: completed,
        timeElapsed: totalSeconds,
        errorMap: errorMap,
        recordError: recordError,
        setCompleted: setCompleted,
        setCorrect: setCorrect,
        setIncorrect: setIncorrect,
        setUserInput: setUserInput,
        setTargetCharCount: () => {},
        setTypedCharCount: () => {},
        restartState: restartProgressState,
    };

    const handlers: Handlers = {
        onRestart: () => onRestart(),
        onStart: () => {
            startStopwatch();
            setStarted(true);
        },
        onFinish: () => {
            pauseStopwatch();
        },
        onChangeSong: () => {
            onRestart();
        },
    };

    const onRestart = () => {
        restartProgressState();
        resetStopwatch(undefined, false);
    };

    const endScreen =
        songData && completed ? (
            <EndScreen
                versePage
                initialValue={isOpenEndScreenInitiallyVersePage}
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

    useEffect(() => {
        handlers.onChangeSong?.();

        progressManager.setTargetCharCount(
            songData?.content.stripped != undefined
                ? songData.content.stripped.length
                : 0
        );
    }, [songData?.content.full]);

    return (
        <div
            className={cn(
                "h-[calc(100vh-5rem)] w-full   overflow-hidden relative "
            )}
        >
            {verseTyperTextDisplay == "cylinder" && (
                <CylinderTyper
                    songData={songData}
                    progressManager={progressManager}
                    handlers={handlers}
                    tryVerseOption={true}
                    difficultyModifiers={difficultyModifiers}
                >
                    {endScreen}
                    <Top song={song} cameFrom={cameFrom} />
                </CylinderTyper>
            )}

            {verseTyperTextDisplay == "flat" && (
                <FlatTyper
                    versePage={true}
                    songData={songData}
                    progressManager={progressManager}
                    handlers={handlers}
                    difficultyModifiers={difficultyModifiers}
                >
                    {endScreen}
                    <Top song={song} cameFrom={cameFrom} />
                </FlatTyper>
            )}
        </div>
    );
}

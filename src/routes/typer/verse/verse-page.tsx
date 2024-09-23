import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    SongBanner,
    SongDetail,
    SongHeader,
} from "@/components/ui/song-header";
import { useUiStateStore } from "@/lib/store/ui-state-store";
import { calculateAccuracy, chpm, cn, generateGradient } from "@/lib/utils";
import { ArrowLeftIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useMemo, useState } from "react";
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

export default function VersePage() {
    const queueWindowOpen = useUiStateStore.use.queueWindowOpen();
    const songList = useSongStore.use.songs();
    const verseTyperTextDisplay =
        usePreferenceStore.use.verseTyperTextDisplay();
    const difficultyModifiers = useTextModificationsStore.use.harderOptions();

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

        return {
            song: song,
            content: {
                full: content,
                stripped: content.replace(/(\r\n|\n|\r)/gm, ""),
            },
        };
    }, [content]);

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
    };

    const onRestart = () => {
        restartProgressState();
        resetStopwatch(undefined, false);
    };

    return (
        <div
            className={cn(
                "h-[calc(100vh-5rem)] w-full   overflow-hidden relative "
            )}
        >
            <div className="absolute top-0 left-0 text-xs z-50 flex items-center gap-2 text-muted-foreground">
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
                            size={"small"}
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

            {verseTyperTextDisplay == "cylinder" && (
                <CylinderTyper
                    songData={songData}
                    progressManager={progressManager}
                    handlers={handlers}
                    tryVerseOption={true}
                    difficultyModifiers={difficultyModifiers}
                >
                    {/* <Stats onRestart={onRestart} className="absolute left-0" /> */}
                    {/* <div className="absolute sm:left-8 left-4 bottom-[9rem] sm:bottom-[6rem] z-50">
                        <TextModificationDialog />
                    </div> */}
                </CylinderTyper>
            )}

            {verseTyperTextDisplay == "flat" && (
                <FlatTyper
                    versePage={true}
                    songData={songData}
                    progressManager={progressManager}
                    handlers={handlers}
                ></FlatTyper>
            )}
        </div>
    );
}

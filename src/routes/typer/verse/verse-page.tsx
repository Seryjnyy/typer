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

export default function VersePage() {
    const queueWindowOpen = useUiStateStore.use.queueWindowOpen();
    const songList = useSongStore.use.songs();
    const { state } = useLocation();
    const { content, id, cameFrom } = state;

    const [userInput, setUserInput] = useState("");
    const [completed, setCompleted] = useState(false);
    const [correct, setCorrect] = useState(0);
    const [incorrect, setIncorrect] = useState(0);
    const [errorMap, setErrorMap] = useState(new Map<number, number>());

    const song = useMemo(() => {
        return songList.find((x) => x.id == id);
    }, [songList, id]);

    if (typeof content != "string") {
        throw Error("Verse in incorrect format.");
    }

    if (!content || !id) {
        throw Error("Missing data.");
    }

    const songData: SongData = useMemo(() => {
        if (!content) return { full: "", stripped: "" };

        return {
            full: content,
            stripped: content.replace(/(\r\n|\n|\r)/gm, ""),
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
                "h-[calc(100vh-5rem)] w-full flex overflow-hidden relative"
            )}
        >
            <div className="absolute top-0 left-0 text-xs z-50 flex items-center gap-2 text-muted-foreground">
                <Link to={"/"}>
                    <Button
                        size={"sm"}
                        className="space-x-1 group rounded-none rounded-tl-md"
                        variant={"ghost"}
                    >
                        <ArrowLeftIcon className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back</span>
                    </Button>
                </Link>
                <div className="flex gap-1">
                    {song && (
                        <SongBanner
                            song={song}
                            size={"small"}
                            playButton={false}
                            className="rounded-[2px]"
                        />
                    )}
                    <span>{song?.title}</span>
                    <span>-</span>
                    <span className="opacity-70">{song?.source}</span>
                </div>
            </div>
            {/* <div className="p-2">
                <div className="flex flex-col border rounded-md w-[15rem] h-full">


                    <div className="p-12">
                        <BackButton link={cameFrom ?? "/"} />
                    </div>
                    <div className="mx-2 space-y-4">
                        <div className="border p-2 rounded-md">
                            <span className="font-semibold">Verse from:</span>
                            {song ? (
                                <SongHeader>
                                    <SongBanner
                                        song={song}
                                        playButton={false}
                                    ></SongBanner>
                                    <SongDetail isCurrent={true} song={song} />
                                </SongHeader>
                            ) : (
                                <div className="bg-secondary rounded-md text-sm p-2">
                                    Missing data.
                                </div>
                            )}
                        </div>
                        <div className="border rounded-md  p-2">
                            <Stat title="time" stat={totalSeconds} append="s" />
                            <Stat
                                title="chpm"
                                stat={
                                    totalSeconds == 0
                                        ? userInput.length
                                        : chpm(userInput.length, totalSeconds)
                                }
                            />
                            <Stat
                                title="accuracy"
                                stat={calculateAccuracy(
                                    correct,
                                    userInput.length
                                )}
                                append="%"
                            />
                            <Stat
                                title="ch"
                                stat={`${userInput.length}/${songData.stripped.length}`}
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
                            <Progress
                                value={
                                    (userInput.length /
                                        songData.stripped.length) *
                                    100
                                }
                            />
                            {userInput.length == songData.stripped.length && (
                                <div className="text-primary flex justify-center text-xs uppercase opacity-80">
                                    <span>complete</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div> */}
            <div className="w-full">
                <FlatTyper
                    songData={songData}
                    progressManager={progressManager}
                    handlers={handlers}
                ></FlatTyper>
            </div>
        </div>
    );
}

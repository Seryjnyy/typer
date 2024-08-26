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
import Typing, { Handlers, ProgressManager, SongData } from "../typing";
import { useSongStore } from "@/lib/store/song-store";
import BackButton from "@/components/ui/back-button";

export default function VersePage() {
    const queueWindowOpen = useUiStateStore.use.queueWindowOpen();
    const songList = useSongStore.use.songs();
    const { state } = useLocation();
    const { content, id } = state;

    const [userInput, setUserInput] = useState("");
    const [completed, setCompleted] = useState(false);
    const [correct, setCorrect] = useState(0);
    const [incorrect, setIncorrect] = useState(0);
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
        if (!content) return { song: "", songStripped: "" };

        return {
            song: content,
            songStripped: content.replace(/(\r\n|\n|\r)/gm, ""),
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

    const progressManager: ProgressManager = {
        userInput: userInput,
        completed: completed,
        setCompleted: setCompleted,
        setCorrect: setCorrect,
        setIncorrect: setIncorrect,
        setUserInput: setUserInput,
        setTargetCharCount: () => {},
        setTypedCharCount: () => {},
        restartState: restartProgressState,
    };

    const handlers: Handlers = {
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
            className={cn("h-full flex", queueWindowOpen ? "" : "pr-[15.5rem]")}
        >
            {/* <Stats>
        {
            <Button variant={"secondary"} onClick={onRestart}>
                reset song progress
            </Button>
        }
    </Stats> */}
            <div className="flex flex-col">
                <div className="p-12">
                    <BackButton link="/" />
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
                            stat={calculateAccuracy(correct, userInput.length)}
                            append="%"
                        />
                        <Stat
                            title="ch"
                            stat={`${userInput.length}/${songData.songStripped.length}`}
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
                                    songData.songStripped.length) *
                                100
                            }
                        />
                        {userInput.length == songData.songStripped.length && (
                            <div className="text-primary flex justify-center text-xs uppercase opacity-80">
                                <span>complete</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Typing
                songData={songData}
                progressManager={progressManager}
                handlers={handlers}
            >
                {/* {!autoplay && completed && (
                    <EndScreen
                        onRestart={onRestart}
                        userInputLength={userInput.length}
                    />
                )} */}
            </Typing>
        </div>
    );
}

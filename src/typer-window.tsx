import { useEffect, useMemo, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useQueueStore } from "./lib/store/queue-store";
import { useSongStore } from "./lib/store/song-store";
import { useStopwatch } from "react-timer-hook";
import { Button } from "./components/ui/button";
import { useSongProgressStore } from "./lib/store/song-progress-store";
import { TrackNextIcon, TrackPreviousIcon } from "@radix-ui/react-icons";

export default function TyperWindow() {
    const queue = useQueueStore();
    const songList = useSongStore.use.songs();
    const {
        totalSeconds,
        seconds,
        minutes,
        hours,
        days,
        isRunning,
        start,
        pause,
        reset,
    } = useStopwatch({ autoStart: false });
    const [playing, setPlaying] = useState(false);
    const [userInput, setUserInput] = useState<string>("");
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const songProgress = useSongProgressStore();

    const song = useMemo(
        () => songList.find((x) => x.id == queue.current),
        [songList, queue.current]
    );

    useEffect(() => {
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

    const focus = () => {
        if (canPlay && !songProgress.completed) {
            inputRef.current?.focus();
        }
    };

    useHotkeys("*", (k, handler) => {
        focus();
        if (canPlay && !playing) {
            setPlaying(true);
            start();
        }
    });

    useEffect(() => {
        if (!playing) pause();
    }, [playing]);

    useEffect(() => {
        if (songProgress.completed) {
            pause();
        }
    }, [songProgress.completed]);

    const res = useMemo(() => {
        let accuracy = 0;
        let inputted = 0;
        let correct = 0;
        let wrong = 0;

        if (song == undefined) {
            return { display: "", inputChar: 0, totalChar: 0 };
        }

        const display = Array.from(song.content).map((ch, i) => {
            if (i == userInput.length) {
                inputted = i;
                return (
                    <span className="bg-yellow-200 p-1 rounded-md" key={i}>
                        {ch}
                    </span>
                );
            }

            if (i > userInput.length)
                return (
                    <span key={i} className="rounded-md">
                        {ch}
                    </span>
                );

            if (ch == userInput.charAt(i)) {
                correct += 1;
                return (
                    <span className="bg-green-200 " key={i}>
                        {ch}
                    </span>
                );
            } else {
                wrong += 1;
                return (
                    <span className="bg-red-200 " key={i}>
                        {ch}
                    </span>
                );
            }

            return ch;
        });

        const display2 = Array.from(song.content).map((ch, i) => {
            if (i == userInput.length) {
                inputted = i;
                return (
                    <span
                        className="rounded-md relative before:content-[''] before:bg-yellow-300  before:px-[0.08rem] before:animate-pulse text-gray-600"
                        key={i}
                    >
                        {ch}
                        {/* <span className="absolute conte"></span> */}
                    </span>
                );
            }

            if (i > userInput.length)
                return (
                    <span key={i} className="rounded-md text-gray-600">
                        {ch}
                    </span>
                );

            if (ch == userInput.charAt(i)) {
                correct += 1;
                return (
                    <span className="text-foreground " key={i}>
                        {ch}
                    </span>
                );
            } else {
                wrong += 1;
                if (ch == " " || ch == "\n") {
                    return (
                        <span className="text-red-400 " key={i}>
                            {userInput.charAt(i)}
                            {ch == " " ? " " : "\n"}
                        </span>
                    );
                }

                return (
                    <span className="text-red-400 " key={i}>
                        {ch}
                    </span>
                );
            }

            return ch;
        });

        // if (userInput.length === 0) {
        //   console.log(100);
        // } else {
        //   accuracy = ((correct - wrong) / userInput.length) * 100;
        //   console.log(accuracy);
        // }

        return {
            display: display2,
            // accuracy: 100,
            totalChar: song.content.length,
            inputChar: userInput.length,
            // :
        };
    }, [song, userInput]);

    const onStopPlaying = () => {
        setPlaying(false);
    };

    const onUserInput = (input: string) => {
        const finished = userInput.length + 1 == song?.content.length;
        if (finished) {
            songProgress.setCompleted(true);
        }

        if (songProgress.completed) return;
        setUserInput(input);
    };

    return (
        <div className="w-full h-full px-24 p-24 relative ">
            {/* <Button onClick={onStopPlaying}>Stop</Button> */}
            {songProgress.completed && (
                <div className="absolute backdrop-blur-lg left-[50%] -translate-x-[50%] w-[70%] h-[50%] z-20">
                    <div className="flex h-full flex-col justify-between">
                        <div className="mx-auto my-auto">
                            <h2>Good job!</h2>
                            <div>
                                <span>56wpm</span>
                                <span>425s</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Button size={"icon"}>
                                    <TrackPreviousIcon />
                                </Button>
                                <div className="flex flex-col leading-tight">
                                    <span>{"song.title"}</span>
                                    <span className="text-muted-foreground text-sm">
                                        {"song.source"}
                                    </span>
                                </div>
                            </div>
                            <Button>Retry</Button>
                            <div className="flex items-center gap-2">
                                <div className="flex flex-col leading-tight">
                                    <span>{"song.title"}</span>
                                    <span className="text-muted-foreground text-sm">
                                        {"song.source"}
                                    </span>
                                </div>
                                <Button size={"icon"}>
                                    <TrackNextIcon />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="w-full h-full  relative">
                <textarea
                    value={userInput}
                    onChange={(e) => onUserInput(e.target.value)}
                    placeholder="what"
                    className=" border opacity-0 absolute"
                    ref={inputRef}
                    disabled={songProgress.completed}
                />

                <div className="border p-4  border-black space-y-2">
                    <div className=" whitespace-pre-wrap  p-8 rounded-md mx-auto w-fit text-lg tracking-wide leading-10 font-semibold">
                        {res.display}
                    </div>
                </div>
            </div>
        </div>
    );
}

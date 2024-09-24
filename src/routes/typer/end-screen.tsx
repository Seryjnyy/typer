import { Button } from "@/components/ui/button";
import { useQueueStore } from "@/lib/store/queue-store";
import { useSongProgressStore } from "@/lib/store/song-progress-store";
import { useSongStore } from "@/lib/store/song-store";
import { Song } from "@/lib/types";
import { calculateAccuracy, chpm, cn, wpm } from "@/lib/utils";
import {
    Cross1Icon,
    HamburgerMenuIcon,
    ReloadIcon,
    TrackNextIcon,
    TrackPreviousIcon,
} from "@radix-ui/react-icons";
import { ButtonHTMLAttributes, useMemo, useState } from "react";

interface QueueControlButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    song: Song | undefined;
    controlType: "next" | "prev";
}

const QueueControlButton = ({
    song,
    controlType,
    ...props
}: QueueControlButtonProps) => {
    return (
        <Button
            variant={"ghost"}
            className="group flex gap-2 items-center rounded-none"
            disabled={song == null}
            {...props}
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

const EndScreenFooter = ({
    onRestart,
    versePage,
}: {
    onRestart: () => void;
    versePage: boolean;
}) => {
    const getSongData = useSongStore.use.getSongData();
    const getNextSong = useQueueStore.use.getNextSong();
    const getPrevSong = useQueueStore.use.getPrevSong();
    const next = useQueueStore.use.next();
    const prev = useQueueStore.use.prev();

    const prevSongID = getPrevSong();
    const prevSong = prevSongID ? getSongData(prevSongID) : undefined;

    const nextSongID = getNextSong();
    const nextSong = nextSongID ? getSongData(nextSongID) : undefined;

    return (
        <div className="sm:w-[22.5rem] md:w-[30rem] sm:flex sm:justify-between sm:flex-row border p-2 flex flex-col items-center gap-4 sm:gap-0 ">
            <div className="w-[12rem]  flex justify-start">
                {!versePage && (
                    <QueueControlButton
                        song={prevSong}
                        controlType="prev"
                        onClick={prev}
                    />
                )}
            </div>

            <Button variant={"ghost"} size={"icon"} onClick={onRestart}>
                <ReloadIcon />
            </Button>

            <div className="w-[12rem]  flex justify-end">
                {!versePage && (
                    <QueueControlButton
                        song={nextSong}
                        controlType="next"
                        onClick={next}
                    />
                )}
            </div>
        </div>
    );
};

// const Stat = ({ title, value }: { title: string; value: string | number }) => {
//     return (
//         <div className="flex flex-col">
//             <span className="text-muted-foreground text-xl">{title}</span>
//             <span className="text-primary text-3xl font-semibold">{value}</span>
//         </div>
//     );
// };

const Stat2 = ({ title, value }: { title: string; value: string | number }) => {
    return (
        <div className="flex items-end">
            <span className="text-primary text-3xl font-semibold">{value}</span>
            <span className="text-muted-foreground text-xl">{title}</span>
        </div>
    );
};

export default function EndScreen({
    onRestart,
    userInputLength,
    initialValue,
    song,
    stats: { timeElapsed, typedChars, correct, incorrect, errorMap },
    versePage,
}: {
    onRestart: () => void;
    userInputLength: number;
    initialValue?: boolean;
    song: Song;
    stats: {
        timeElapsed: number;
        typedChars: number;
        correct: number;
        incorrect: number;
        errorMap: Map<number, number>;
    };
    versePage?: boolean;
}) {
    const [open, setOpen] = useState(initialValue ?? true);

    // const currentSongID = useQueueStore.use.current();
    // const getSongData = useSongStore.use.getSongData();

    // const playNextSong = useQueueStore.use.();

    // const timeElapsed = useSongProgressStore.use.timeElapsed();

    // const typedChars = useSongProgressStore.use.songTypedChar();
    // const errorMap = useSongProgressStore.use.errorMap();

    // const correct = useSongProgressStore.use.correct();
    // const incorrect = useSongProgressStore.use.incorrect();

    // if (!currentSongID) return <></>;

    // const songData = getSongData(currentSongID);

    const errorTotal = useMemo(() => {
        const arrFromError = Array.from(errorMap.values());

        return arrFromError.length > 0
            ? arrFromError.reduce((prev, curr) => prev + curr)
            : 0;
    }, [errorMap]);

    return (
        <div
            className={cn(
                "absolute w-[98%] h-[70vh] sm:h-[calc(100vh-10rem)] backdrop-blur-lg border   flex justify-center right-[1%] top-2 z-[300] bg-gradient-to-t from-transparent  rounded-md from-50%",
                song?.cover.split(" ")[2] ?? "to-transparent",
                { "max-h-9 w-9 border-none": !open }
            )}
        >
            <div className="w-full h-full relative  ">
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
                        <div className="text-center backdrop-brightness-50 rounded-sm p-2 ">
                            <h2 className="text-6xl font-semibold">
                                {song?.title}
                            </h2>
                            <span className="text-foreground/50 text-md">
                                {song?.source}
                            </span>
                            {versePage && (
                                <span className="block text-foreground/40">
                                    -verse mode-
                                </span>
                            )}
                        </div>
                        <div className=" w-full rounded-lg p-12 flex flex-col items-center gap-12">
                            <div className=" flex gap-6 flex-col items-center">
                                <div className="flex gap-4 border  p-1 rounded-md px-2">
                                    <Stat2 title="ch" value={typedChars} />

                                    <Stat2 title="s" value={timeElapsed} />
                                    <div className="border-l  pl-2 flex gap-2">
                                        <Stat2
                                            title="chpm"
                                            value={
                                                timeElapsed == 0
                                                    ? userInputLength
                                                    : chpm(
                                                          userInputLength,
                                                          timeElapsed
                                                      )
                                            }
                                        />
                                        <Stat2
                                            title="wpm"
                                            value={
                                                timeElapsed == 0
                                                    ? userInputLength
                                                    : wpm(
                                                          userInputLength,
                                                          timeElapsed
                                                      )
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="border p-1 rounded-md px-2 flex gap-4">
                                    <Stat2 title="correct" value={correct} />
                                    <Stat2
                                        title="incorrect"
                                        value={incorrect}
                                    />
                                    <div className="border-l  pl-2    ">
                                        <Stat2
                                            title="acc"
                                            value={`${calculateAccuracy(
                                                correct,
                                                userInputLength
                                            )}%`}
                                        />
                                    </div>
                                    <div className="border-l pl-2">
                                        <Stat2
                                            title="errors"
                                            value={errorTotal}
                                        />
                                    </div>
                                </div>
                            </div>

                            <EndScreenFooter
                                onRestart={onRestart}
                                versePage={versePage ?? false}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

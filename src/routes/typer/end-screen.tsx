import { Button } from "@/components/ui/button";
import { useQueueStore } from "@/lib/store/queue-store";
import { useSongProgressStore } from "@/lib/store/song-progress-store";
import { useSongStore } from "@/lib/store/song-store";
import { Song } from "@/lib/types";
import { calculateAccuracy, chpm, cn } from "@/lib/utils";
import {
    Cross1Icon,
    HamburgerMenuIcon,
    ReloadIcon,
    TrackNextIcon,
    TrackPreviousIcon,
} from "@radix-ui/react-icons";
import { useState } from "react";

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

const Stat = ({ title, value }: { title: string; value: string | number }) => {
    return (
        <div className="flex flex-col">
            <span className="text-muted-foreground text-xl">{title}</span>
            <span className="text-primary text-3xl font-semibold">{value}</span>
        </div>
    );
};

export default function EndScreen({
    onRestart,
    userInputLength,
}: {
    onRestart: () => void;
    userInputLength: number;
}) {
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
                "absolute w-[98%] h-[60vh] backdrop-blur-[6px] border rounded-xl  flex justify-center right-[1%] top-[10%] z-40",
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
                            <h2 className="text-6xl font-semibold">
                                {songData?.title}
                            </h2>
                            <span className="text-muted-foreground text-md">
                                {songData?.source}
                            </span>
                        </div>
                        <div className="bg-secondary w-full rounded-lg p-12 flex flex-col items-center gap-12">
                            <div className=" flex gap-12">
                                <Stat
                                    title="chpm"
                                    value={
                                        timeElapsed == 0
                                            ? userInputLength
                                            : chpm(userInputLength, timeElapsed)
                                    }
                                />
                                <Stat
                                    title="acc"
                                    value={`${calculateAccuracy(
                                        correct,
                                        userInputLength
                                    )}%`}
                                />

                                <Stat title="ch" value={typedChars} />

                                <Stat title="s" value={timeElapsed} />
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
                    </div>
                )}
            </div>
        </div>
    );
}

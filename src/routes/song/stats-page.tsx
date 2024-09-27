import { Button } from "@/components/ui/button";
import {
    SongBanner,
    SongDetail,
    SongHeader,
} from "@/components/ui/song-header";
import { useSongStore } from "@/lib/store/song-store";
import { GearIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
export default function StatsPage() {
    const songs = useSongStore.use.songs();

    const completion = useMemo(() => {
        const sorted = songs.sort((a, b) => b.completion - a.completion);
        const most = sorted[0];
        const least = sorted[sorted.length - 1];

        return [
            { song: most, amount: most.completion, label: "Most completed" },
            { song: least, amount: least.completion, label: "Least completed" },
        ];
    }, [songs]);

    const totalCompletion = useMemo(() => {
        let count = 0;
        for (const song of songs) {
            count += song.completion;
        }
        return count;
    }, [songs]);

    const typedChar = useMemo(() => {
        let count = 0;
        for (const song of songs) {
            count += song.completion * song.content.length;
        }
        return count;
    }, [songs]);

    const longestTypedSong = useMemo(() => {
        const res = songs
            .filter((song) => song.completion > 0)
            .sort((a, b) => a.content.length - b.content.length);

        return res.length > 0 ? res[0] : null;
    }, [songs]);

    return (
        <ScrollArea className="h-[calc(100vh-11rem)] w-full px-2 sm:px-6 md:px-12 rounded-b-md">
            <div className="flex flex-col gap-12 pt-8">
                <div>
                    <div className="flex items-center gap-1">
                        <h2 className="text-xl font-semibold text-muted-foreground pb-2 flex items-center gap-2">
                            Stats from current songs{" "}
                        </h2>
                        <Dialog>
                            <DialogTrigger>
                                <InfoCircledIcon />
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Are you absolutely sure?
                                    </DialogTitle>
                                    <DialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete your account and
                                        remove your data from our servers.
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="p-2 border rounded-sm space-y-8 px-4 py-4">
                        {completion.map((entry) => (
                            <div className="space-y-2">
                                <span className="font-semibold">
                                    {entry.label}
                                </span>
                                <div className="pl-4 flex items-center w-full justify-between">
                                    <SongHeader>
                                        <SongBanner song={entry.song} />
                                        <SongDetail song={entry.song} />
                                    </SongHeader>
                                    <span className="text-nowrap">
                                        <span className="font-bold">
                                            {entry.amount}
                                        </span>{" "}
                                        <span className="text-muted-foreground">
                                            completions
                                        </span>
                                    </span>
                                </div>
                            </div>
                        ))}

                        <div>
                            <span className="font-semibold">Completions</span>
                            <div>{totalCompletion}</div>
                        </div>
                        <div>
                            <span className="font-semibold">
                                TotalTypedChar
                            </span>
                            <div>{typedChar}</div>
                        </div>
                        <div className="space-y-2">
                            <span className="font-semibold">
                                Longest typed song
                            </span>
                            {longestTypedSong ? (
                                <div className="pl-4 flex items-center w-full justify-between">
                                    <SongHeader>
                                        <SongBanner song={longestTypedSong} />
                                        <SongDetail song={longestTypedSong} />
                                    </SongHeader>
                                    <span className="text-nowrap">
                                        <span className="font-bold">
                                            {longestTypedSong.content.length}
                                        </span>{" "}
                                        <span className="text-muted-foreground">
                                            ch
                                        </span>
                                    </span>
                                </div>
                            ) : (
                                <span>None so far</span>
                            )}
                        </div>
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-muted-foreground pb-2 flex items-center gap-2">
                        Stats from all time <InfoCircledIcon />
                    </h2>
                    <div className="w-full h-12 border rounded-md"></div>
                </div>
            </div>
            {/* <div className="flex justify-end mt-8">
                <Link to="/settings/stats">
                    <Button size={"sm"} variant={"ghost"} className="space-x-2">
                        <GearIcon /> <span>Stats settings</span>
                    </Button>
                </Link>
            </div> */}
        </ScrollArea>
    );
}

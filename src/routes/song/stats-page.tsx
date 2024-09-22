import { Button } from "@/components/ui/button";
import {
    SongBanner,
    SongDetail,
    SongHeader,
} from "@/components/ui/song-header";
import { useSongStore } from "@/lib/store/song-store";
import { GearIcon } from "@radix-ui/react-icons";
import React, { useMemo } from "react";
import { Link } from "react-router-dom";

export default function StatsPage() {
    const songs = useSongStore.use.songs();

    const { mostCompleted, leastCompleted } = useMemo(() => {
        const sorted = songs.sort((a, b) => b.completion - a.completion);
        return {
            mostCompleted: sorted[0],
            leastCompleted: sorted[sorted.length - 1],
        };
    }, [songs]);

    return (
        <div className="space-y-12 pt-12">
            <Link to="/settings">
                <Button size={"sm"} variant={"ghost"} className="space-x-2">
                    <GearIcon /> <span>Stats settings</span>
                </Button>
            </Link>
            <div>
                <h2 className="text-lg font-semibold text-muted-foreground">
                    Stats from current songs,
                </h2>
                <div className="p-2 border rounded-sm">
                    <div>
                        <span>Most completed</span>
                        <span>
                            <SongHeader>
                                <SongBanner song={mostCompleted} />
                                <SongDetail song={mostCompleted} />
                            </SongHeader>
                        </span>
                    </div>
                    <div>
                        <span>Least completed</span>
                        <SongHeader>
                            <SongBanner song={leastCompleted} />
                            <SongDetail song={leastCompleted} />
                        </SongHeader>
                    </div>
                </div>
            </div>
        </div>
    );
}

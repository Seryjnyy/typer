import SongCarousel from "@/components/song-carousel";
import { Button } from "@/components/ui/button";
import { useSongStore } from "@/lib/store/song-store";
import { useUiStateStore } from "@/lib/store/ui-state-store";
import { cn, shuffleArray } from "@/lib/utils";
import { PlusIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";

export default function NoSongSelected() {
    const songs = useSongStore.use.songs();
    const isQueueWindowOpen = useUiStateStore.use.queueWindowOpen();

    const shortened = useMemo(() => {
        const shuffled = shuffleArray(songs);
        return shuffled.slice(0, Math.min(shuffled.length, 10));
    }, [songs]);

    console.log(shortened.length);

    return (
        <div
            className={cn(
                "flex w-full items-center justify-center  flex-col "
                // isQueueWindowOpen ? "" : "pl-[15rem]"
            )}
        >
            <h2 className="font-bold text-3xl">No song selected.</h2>
            <div className="flex flex-col justify-center items-center  ">
                {songs.length > 0 && (
                    <div className="space-y-1">
                        <h3 className=" text-muted-foreground mx-auto w-fit text-md mb-8">
                            Here are some of your songs.
                        </h3>

                        <div className="overflow-hidden w-[80vw]">
                            <SongCarousel songs={shortened} />
                        </div>
                    </div>
                )}
                {/* {songs.length > 0 && (
                    <div className="font-bold text-muted-foreground py-8">
                        or
                    </div>
                )} */}
                <div className="flex flex-col gap-3">
                    {songs.length == 0 && (
                        <div className="flex flex-col justify-center items-center">
                            <span className="text-sm text-muted-foreground">
                                Seems like you don't have any songs yet :/
                            </span>
                            <span className="text-sm text-muted-foreground">
                                No worries you can add some.
                            </span>
                        </div>
                    )}
                    <Button className="space-x-2" variant={"secondary"}>
                        <PlusIcon />
                        <span>Add new song</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}

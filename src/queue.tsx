import { Cross1Icon, PlayIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";
import { Button } from "./components/ui/button";
import { ScrollArea } from "./components/ui/scroll-area";
import { useQueueStore } from "./lib/store/queue-store";
import { useSongStore } from "./lib/store/song-store";
import { cn } from "./lib/utils";
export default function Queue() {
  const queue = useQueueStore();
  const songList = useSongStore.use.songs();
  const songs = useMemo(() => {
    const res = queue.songs.map((songId) =>
      songList.find((x) => x.id == songId)
    );

    return res.filter((x) => x != undefined);
  }, [queue.songs, songList]);

  const onRemoveFromQueue = (songId: string) => {
    queue.removeSong(songId);
    console.log(queue.songs);
  };

  const onPlay = (songId: string) => {
    queue.setCurrent(songId);
  };

  return (
    <div className="h-full">
      <ScrollArea className="h-full w-[250px] border p-4">
        {songs.map((song) => (
          <div
            className={cn("border p-4", {
              "bg-red-200": queue.current == song.id,
            })}
            key={song.id}
          >
            <div className="flex flex-col">
              <span>{song.title}</span>
              <span className="text-muted-foreground text-sm">
                {song.source}
              </span>
            </div>
            <div className="flex justify-between">
              <Button onClick={() => onPlay(song.id)}>
                <PlayIcon />
              </Button>
              <Button onClick={() => onRemoveFromQueue(song.id)} size={"icon"}>
                <Cross1Icon />
              </Button>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}

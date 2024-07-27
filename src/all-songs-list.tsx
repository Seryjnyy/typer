import { Button } from "./components/ui/button";
import { ScrollArea } from "./components/ui/scroll-area";
import { useQueueStore } from "./lib/store/queue-store";
import { useSongStore } from "./lib/store/song-store";
import { useSongs } from "./lib/use-songs";

export default function SongList() {
  const songStore = useSongStore();
  const queue = useQueueStore();

  const onAddToQueue = (songId: string) => {
    queue.addSong(songId);
  };

  return (
    <div>
      All songs
      <ScrollArea className="h-screen w-[350px] rounded-md border p-4">
        <Button
          onClick={() =>
            songStore.addSong({
              id: "test" + Date.now().toString(),
              content: "test" + Date.now().toString(),
              source: "test" + Date.now().toString(),
              title: "test" + Date.now().toString(),
            })
          }
        >
          Add
        </Button>
        {songStore.songs.map((song) => (
          <div className="border p-4" key={song.id}>
            <div className="flex flex-col">
              <span>{song.title}</span>
              <span className="text-muted-foreground text-sm">
                {song.source}
              </span>
            </div>
            <Button onClick={() => onAddToQueue(song.id)}>Add to queue</Button>
            <Button onClick={() => songStore.removeSong(song.id)}>
              Remove
            </Button>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}

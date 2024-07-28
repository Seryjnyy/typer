import { CaretUpIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";
import { Button } from "./components/ui/button";
import { useQueueStore } from "./lib/store/queue-store";
import { useSongStore } from "./lib/store/song-store";
import QueueControl from "./queue-control";
import WindowControls from "./window-controls";

export default function BottomNav() {
  const queue = useQueueStore();
  const songList = useSongStore.use.songs();

  const songData = useMemo(() => {
    return songList.find((x) => x.id == queue.current);
  }, [queue.current, songList]);

  return (
    <div className="w-full bg-background p-3 flex justify-between border h-16">
      <QueueControl />
      <div className="flex flex-col">
        <span>{songData?.title}</span>
        <span className="text-muted-foreground text-sm">
          {songData?.source}
        </span>
      </div>
      <div className="flex gap-8">
        <WindowControls />
        <Button size={"icon"}>
          <CaretUpIcon />
        </Button>
      </div>
    </div>
  );
}

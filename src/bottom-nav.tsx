import React, { useMemo } from "react";
import QueueControl from "./queue-control";
import { useQueueStore } from "./lib/store/queue-store";
import { useSongStore } from "./lib/store/song-store";
import { Button } from "./components/ui/button";
import {
  CaretUpIcon,
  FileTextIcon,
  GearIcon,
  KeyboardIcon,
} from "@radix-ui/react-icons";

export default function BottomNav() {
  const queue = useQueueStore();
  const songList = useSongStore.use.songs();

  const songData = useMemo(() => {
    return songList.find((x) => x.id == queue.current);
  }, [queue.current, songList]);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-background p-3 flex justify-between border">
      <QueueControl />
      <div className="flex flex-col">
        <span>{songData?.title}</span>
        <span className="text-muted-foreground text-sm">
          {songData?.source}
        </span>
      </div>
      <div className="flex gap-8">
        <div>
          <Button size={"icon"}>
            <KeyboardIcon />
          </Button>
          <Button size={"icon"}>
            <FileTextIcon />
          </Button>
          <Button size={"icon"}>
            <GearIcon />
          </Button>
        </div>
        <Button size={"icon"}>
          <CaretUpIcon />
        </Button>
      </div>
    </div>
  );
}

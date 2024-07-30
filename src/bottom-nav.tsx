import {
  CaretDownIcon,
  CaretUpIcon,
  PauseIcon,
  PlayIcon,
  ShuffleIcon,
} from "@radix-ui/react-icons";
import { useMemo } from "react";
import { Button } from "./components/ui/button";
import { useQueueStore } from "./lib/store/queue-store";
import { useSongStore } from "./lib/store/song-store";
import QueueControl from "./queue-control";
import WindowControls from "./window-controls";
import { useUiStateStore } from "./lib/store/ui-state-store";

export default function BottomNav() {
  const uiState = useUiStateStore();
  const queue = useQueueStore();
  const songList = useSongStore.use.songs();

  const songData = useMemo(() => {
    return songList.find((x) => x.id == queue.current);
  }, [queue.current, songList]);

  const onToggleQueueWindow = () => {
    uiState.setQueueWindowOpen(!uiState.queueWindowOpen);
  };

  // TODO : might need to force rerender window
  const onPlaySong = () => {
    if (uiState.currentWindow != "typer") {
      uiState.setCurrentWindow("typer");
    }
  };

  return (
    <div className="w-full bg-background p-3 flex justify-between border h-16">
      <QueueControl>
        <Button onClick={onPlaySong}>
          <PlayIcon />
        </Button>
      </QueueControl>
      <div className="flex flex-col max-w-[12rem]">
        <span className="text-ellipsis overflow-hidden">{songData?.title}</span>
        <span className="text-muted-foreground text-sm text-ellipsis overflow-hidden">
          {songData?.source}
        </span>
      </div>
      <div className="flex gap-8">
        <div className="flex items-center gap-2">
          <Button>
            <ShuffleIcon />
          </Button>
          <Button variant={"outline"}>
            {/* <div className=" flex gap-2  rounded-md">
              <div className="bg-card p-1 rounded-lg">
                <PauseIcon className="text-card-foreground" />
              </div>
              <div className="bg-card p-1 rounded-lg border">
                <PlayIcon className="text-card-foreground  " />
              </div>
            </div> */}
            <div className="flex items-center gap-2">
              <span className="text-xs">auto</span> <PlayIcon />
            </div>
          </Button>
        </div>
        <WindowControls />
        <Button size={"icon"} onClick={onToggleQueueWindow}>
          {!uiState.queueWindowOpen && <CaretUpIcon />}
          {uiState.queueWindowOpen && <CaretDownIcon />}
        </Button>
      </div>
    </div>
  );
}

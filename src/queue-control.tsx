import { TrackNextIcon, TrackPreviousIcon } from "@radix-ui/react-icons";
import { Button } from "./components/ui/button";
import { useQueueStore } from "./lib/store/queue-store";
import { ReactNode } from "react";

export default function QueueControl({ children }: { children?: ReactNode }) {
  const queue = useQueueStore();

  const onNext = () => {
    const currentSongIndex = queue.songs.findIndex((x) => x == queue.current);

    // If index is -1 but there are songs in the queue
    if (currentSongIndex == -1 && queue.songs.length > 0) {
      queue.setCurrent(queue.songs[0]);
      return;
    }

    // if index is -1 and there is no songs in queue
    if (currentSongIndex == -1) {
      return;
    }

    // if at the end of queue
    if (currentSongIndex + 1 >= queue.songs.length) {
      return;
    }

    queue.setCurrent(queue.songs[currentSongIndex + 1]);
  };

  const onPrev = () => {
    const currentSongIndex = queue.songs.findIndex((x) => x == queue.current);

    // If index is -1 but there are songs in the queue
    if (currentSongIndex == -1 && queue.songs.length > 0) {
      queue.setCurrent(queue.songs[0]);
      return;
    }

    // if index is -1 and there is no songs in queue
    if (currentSongIndex == -1) {
      return;
    }

    // if at the start of queue
    if (currentSongIndex - 1 < 0) {
      return;
    }

    queue.setCurrent(queue.songs[currentSongIndex - 1]);
  };

  return (
    <div className="space-x-4">
      <Button onClick={onPrev}>
        <TrackPreviousIcon />
      </Button>
      {children}
      <Button onClick={onNext}>
        <TrackNextIcon />
      </Button>
    </div>
  );
}

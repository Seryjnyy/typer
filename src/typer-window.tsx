import { useEffect, useMemo, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useQueueStore } from "./lib/store/queue-store";
import { useSongStore } from "./lib/store/song-store";
import { useStopwatch } from "react-timer-hook";
import { Button } from "./components/ui/button";

export default function TyperWindow() {
  const queue = useQueueStore();
  const songList = useSongStore.use.songs();
  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({ autoStart: false });
  const [playing, setPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [userInput, setUserInput] = useState<string>("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const song = useMemo(
    () => songList.find((x) => x.id == queue.current),
    [songList, queue.current]
  );

  const canPlay = song != undefined;

  const focus = () => {
    if (canPlay && !completed) {
      inputRef.current?.focus();
    }
  };

  useHotkeys("*", (k, handler) => {
    focus();
    if (canPlay && !playing) {
      setPlaying(true);
      start();
    }
  });

  useEffect(() => {
    if (!playing) pause();
  }, [playing]);

  useEffect(() => {
    if (completed) {
      pause();
    }
  }, [completed]);

  const res = useMemo(() => {
    let accuracy = 0;
    let inputted = 0;
    let correct = 0;
    let wrong = 0;

    if (song == undefined) {
      return { display: "", inputChar: 0, totalChar: 0 };
    }

    const display = Array.from(song.content).map((ch, i) => {
      if (i == userInput.length) {
        inputted = i;
        return (
          <span className="bg-yellow-200 p-1 rounded-md" key={i}>
            {ch}
          </span>
        );
      }

      if (i > userInput.length)
        return (
          <span key={i} className="rounded-md">
            {ch}
          </span>
        );

      if (ch == userInput.charAt(i)) {
        correct += 1;
        return (
          <span className="bg-green-200 " key={i}>
            {ch}
          </span>
        );
      } else {
        wrong += 1;
        return (
          <span className="bg-red-200 " key={i}>
            {ch}
          </span>
        );
      }

      return ch;
    });

    const display2 = Array.from(song.content).map((ch, i) => {
      if (i == userInput.length) {
        inputted = i;
        return (
          <span
            className="rounded-md relative before:content-[''] before:bg-yellow-300  before:px-[0.08rem] before:animate-pulse text-gray-600"
            key={i}
          >
            {ch}
            {/* <span className="absolute conte"></span> */}
          </span>
        );
      }

      if (i > userInput.length)
        return (
          <span key={i} className="rounded-md text-gray-600">
            {ch}
          </span>
        );

      if (ch == userInput.charAt(i)) {
        correct += 1;
        return (
          <span className="text-black " key={i}>
            {ch}
          </span>
        );
      } else {
        wrong += 1;
        if (ch == " " || ch == "\n") {
          return (
            <span className="text-red-400 " key={i}>
              {userInput.charAt(i)}
              {ch == " " ? " " : "\n"}
            </span>
          );
        }

        return (
          <span className="text-red-400 " key={i}>
            {ch}
          </span>
        );
      }

      return ch;
    });

    // if (userInput.length === 0) {
    //   console.log(100);
    // } else {
    //   accuracy = ((correct - wrong) / userInput.length) * 100;
    //   console.log(accuracy);
    // }

    return {
      display: display2,
      // accuracy: 100,
      totalChar: song.content.length,
      inputChar: userInput.length,
      // :
    };
  }, [song, userInput]);

  const onStopPlaying = () => {
    setPlaying(false);
  };

  const onUserInput = (input: string) => {
    const finished = userInput.length == song?.content.length;
    if (finished) {
      setCompleted(true);
    }

    if (completed) return;
    setUserInput(input);
  };

  return (
    <div className="w-full h-full px-24 p-24 bg-green-200">
      <div>
        <span>{totalSeconds}</span> seconds
      </div>
      <div>{completed && "good"}</div>
      <Button onClick={onStopPlaying}>Stop</Button>
      <div className="w-full h-full bg-red-200 relative">
        <textarea
          value={userInput}
          onChange={(e) => onUserInput(e.target.value)}
          placeholder="what"
          className=" border opacity-0 absolute"
          ref={inputRef}
          disabled={completed}
        />

        <div className="border p-4  border-black space-y-2">
          <div className="border p-4 border-black">
            <div>{`${res.inputChar}/${res.totalChar}`}</div>
          </div>

          <div className=" whitespace-pre-wrap bg-blue-200 p-8 rounded-md mx-auto w-fit text-lg tracking-wide leading-10 font-semibold">
            {res.display}
          </div>
        </div>
      </div>
    </div>
  );
}

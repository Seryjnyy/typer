import { useMemo, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { songList } from "./content";
import SongList from "./all-songs-list";
import { useSongs } from "./lib/use-songs";
import Queue from "./queue";
import { useQueueStore } from "./lib/store/queue-store";
import { useSongStore } from "./lib/store/song-store";

export default function TextDisplay() {
  const queue = useQueueStore();
  const songList = useSongStore.use.songs();
  // const [songIndex, setSongIndex] = useState(0);
  // const song = useMemo(() => songList[songIndex], [songIndex, songList]);
  const song = useMemo(
    () => songList.find((x) => x.id == queue.current),
    [songList, queue.current]
  );

  const [userInput, setUserInput] = useState<string>("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const focus = () => {
    inputRef.current?.focus();
  };

  useHotkeys("*", (k, handler) => {
    // focus();
  });

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

  // const onResetSong = () => {
  //   setSongIndex((prev) => prev + 1);
  // };

  return (
    <div className="px-24 p-24">
      {/* {userInput} */}
      <div className="flex">
        <SongList />
      </div>
      <div className="w-full h-full bg-red-200 relative">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="what"
          className=" border opacity-0 absolute"
          ref={inputRef}
        />

        <div className="border p-4  border-black space-y-2">
          <div className="border p-4 border-black">
            <div>{`${res.inputChar}/${res.totalChar}`}</div>
            <div>{`${song?.source} - ${song?.title}`}</div>
          </div>

          <div className="space-x-2">
            {/* <button
              onClick={onResetSong}
              className="border px-8 py-2 border-black"
            >
              reset
            </button> */}
          </div>
          <div className=" whitespace-pre-wrap bg-blue-200 p-8 rounded-md mx-auto w-fit text-lg tracking-wide leading-10 font-semibold">
            {res.display}
          </div>
        </div>
      </div>
    </div>
  );
}

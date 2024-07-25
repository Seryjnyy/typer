import { useMemo, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { songs } from "./content";

export default function TextDisplay() {
  const [songIndex, setSongIndex] = useState(0);
  const song = useMemo(() => songs[songIndex], [songIndex, songs]);

  const [userInput, setUserInput] = useState<string>("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const focus = () => {
    inputRef.current?.focus();
  };

  useHotkeys("*", (k, handler) => {
    focus();
  });

  const res = useMemo(() => {
    let accuracy = 0;
    let inputted = 0;
    let correct = 0;
    let wrong = 0;

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

    // if (userInput.length === 0) {
    //   console.log(100);
    // } else {
    //   accuracy = ((correct - wrong) / userInput.length) * 100;
    //   console.log(accuracy);
    // }

    return {
      display: display,
      // accuracy: 100,
      totalChar: song.content.length,
      inputChar: userInput.length,
      // :
    };
  }, [song.content, userInput]);

  const onNextContent = () => {
    setSongIndex((prev) => {
      console.log(songs.length, prev + 1);
      if (prev + 1 >= songs.length) return prev;
      return prev + 1;
    });
  };

  const onPrevContent = () => {
    setSongIndex((prev) => {
      if (prev - 1 < 0) return prev;

      return prev - 1;
    });
  };

  return (
    <div className="px-24 p-24">
      {/* {userInput} */}
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
            <div>{`${song.source} - ${song.title}`}</div>
          </div>

          <div className="space-x-2">
            <button
              onClick={onPrevContent}
              className="border px-8 py-2 border-black"
              disabled={songIndex - 1 < 0}
            >
              prev
            </button>
            <button
              onClick={onNextContent}
              className="border px-8 py-2 border-black"
              disabled={songIndex + 1 >= songs.length}
            >
              next
            </button>
          </div>
          <div className=" whitespace-pre-wrap bg-blue-200 p-8 rounded-md mx-auto w-fit text-lg tracking-wide leading-10 font-semibold">
            {res.display}
          </div>
        </div>
      </div>
    </div>
  );
}

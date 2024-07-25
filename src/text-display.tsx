import { useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { textContent } from "./content";

export default function TextDisplay() {
  const [text, setText] = useState(textContent);

  const [userInput, setUserInput] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const focus = () => {
    inputRef.current?.focus();
  };

  useHotkeys("*", (k, handler) => {
    //   if (k.key.length > 1 || k.key.length == 0) return;
    //   console.log(k.key);
    focus();
  });

  return (
    <div className="px-24 p-24">
      {userInput}
      <div className="w-fit h-fit relative">
        <input
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="what"
          className="w-full h-full border opacity-0"
          ref={inputRef}
        />
        <div className=" whitespace-pre-wrap ">
          {Array.from(text).map((ch, i) => {
            if (i == userInput.length)
              return <span className="bg-yellow-200">{ch}</span>;

            if (i >= userInput.length) return ch;

            if (ch == userInput.charAt(i)) {
              return <span className="bg-green-200">{ch}</span>;
            } else {
              return <span className="bg-red-200">{ch}</span>;
            }

            return ch;
          })}
        </div>
        {/* <div className=" whitespace-pre-wrap absolute">{text}</div> */}
      </div>
    </div>
  );
}

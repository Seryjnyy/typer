import React, { useState } from "react";
import { Textarea } from "./components/ui/textarea";
import { textModification } from "./lib/utils";

export default function TestPage() {
    // const [value, setValue] = useState("");
    const [history, setHistory] = useState<string[]>([]);

    const updateHistory = (val: string) => {
        const maxLength = 3;
        setHistory((prev) => {
            const newHistory = [...prev, val];

            if (newHistory.length > maxLength) {
                return newHistory.splice(0, newHistory.length - maxLength);
            }

            return newHistory;
        });
    };

    // on user input log history
    const handleUserInput = (val: string) => {
        updateHistory(val);
    };

    React.useEffect(() => {
        console.log(history);
    }, [history]);

    // on txt mod log history

    // textModification(value, {letterCase:"normal", numbers:"normal", punctuation:"normal"})

    const currentValue = history.length > 0 ? history[history.length - 1] : "";
    return (
        <div className="p-5">
            <Textarea
                value={currentValue}
                onChange={(e) => handleUserInput(e.target.value)}
            />
            <div></div>
        </div>
    );
}

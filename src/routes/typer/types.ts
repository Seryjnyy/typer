import { Song } from "@/lib/types";

export interface ProgressManager {
    userInput: string;
    completed: boolean;
    errorMap: Map<number, number>;
    timeElapsed: number;
    setUserInput: (val: string) => void;
    setCompleted: (val: boolean) => void;
    setTypedCharCount: (val: number) => void;
    setTargetCharCount: (val: number) => void;
    setCorrect: (correct: number) => void;
    setIncorrect: (incorrect: number) => void;
    restartState: () => void;
    recordError: (index: number) => void;
}

export interface Handlers {
    onFinish?: () => void;
    onStart?: () => void;
    onChangeSong?: () => void;
    onClickVerse?: (verse: string) => void;
    onRestart?: () => void;
}

export type SongData = {
    song: Song;
    content: {
        full: string;
        stripped: string;
    };
} | null;

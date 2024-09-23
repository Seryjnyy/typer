import { ReactNode } from "react";

export type Windows = "typer" | "song_list" | "settings";

export type Song = {
    id: string;
    title: string;
    source: string;
    content: string;
    cover: string;
    completion: number;
    record: {
        accuracy: number;
        wpm: number;
    };
    createdAt: number;
    lastModifiedAt: number;
};

// export interface GeneratorFunction {
//     elements: ReactNode[];
//     stats: { correct: number; incorrect: number };
//     errorIndex: number | null;
// }

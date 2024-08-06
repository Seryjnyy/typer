export type Windows = "typer" | "song_list" | "settings";

export type Song = {
    id: string;
    title: string;
    source: string;
    content: string;
    completion: number;
};

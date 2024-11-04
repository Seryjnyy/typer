import saveAs from "file-saver";
import { useState } from "react";
import { usePreferenceStore } from "../store/preferences-store";
import { Song } from "../types";

export default function useExportSongs() {
    const [exported, setExported] = useState(0);
    const exportSongPreferences = usePreferenceStore.use.exportSongs();

    const exportSongs = async (songs: Song[]) => {
        if (songs.length == 0) return;

        const songsConverted = songs.map((song) => ({
            title: song.title,
            source: song.source,
            content: song.content,
            cover: exportSongPreferences.cover ? song.cover : undefined,
            completion: exportSongPreferences.completion
                ? song.completion
                : undefined,
            record: exportSongPreferences.record ? song.record : undefined,
            createdAt: exportSongPreferences.createdAt
                ? song.createdAt
                : undefined,
        }));

        const songsArr = { songs: songsConverted };
        const json = JSON.stringify(songsArr, null, 2);

        const blob = new Blob([json], { type: "application/json" });
        saveAs(blob, `(${songs.length})-typer-songs.json`);
        setExported(songs.length);
    };

    const clear = () => {
        setExported(0);
    };

    return { clear, exported, exportSongs };
}

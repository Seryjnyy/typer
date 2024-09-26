import React, { useState } from "react";
import { Song } from "../types";
import saveAs from "file-saver";
import { usePreferenceStore } from "../store/preferences-store";
import { toast } from "@/components/ui/use-toast";

export default function useExportSongs() {
    const [exported, setExported] = useState(0);
    const exportSongPreferences = usePreferenceStore.use.exportSongs();

    const exportSongs = async (songs: Song[]) => {
        if (songs.length == 0) return;

        const songsConverted = songs.map((s) => ({
            title: s.title,
            source: s.source,
            content: s.content,
            cover: exportSongPreferences.cover ? s.cover : undefined,
            completion: exportSongPreferences.completion
                ? s.completion
                : undefined,
            record: exportSongPreferences.record ? s.record : undefined,
            createdAt: exportSongPreferences.createdAt
                ? s.createdAt
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

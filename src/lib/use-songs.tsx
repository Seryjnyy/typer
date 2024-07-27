import { Song, songList } from "@/content";
import React, { useEffect, useState } from "react";

// Incase the source becomes different
export const useSongs = () => {
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    setSongs(songList);
  }, []);

  return { songs };
};

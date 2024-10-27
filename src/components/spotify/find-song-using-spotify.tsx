import { Input } from "@/components/ui/input";
import { useState } from "react";

import { SpotifyApi, Track } from "@spotify/web-api-ts-sdk";
import { debounce } from "lodash";
import { Loader2 } from "lucide-react";
import { ChangeEvent, useCallback } from "react";
import { Label } from "../ui/label";

interface FindSongUsingSpotifyProps {
    apiSDK: SpotifyApi;
    onSelectSong: (song: { title: string; artist: string }) => void;
    initialArtist?: string;
    initialTitle?: string;
}

const FindSongUsingSpotify = ({
    apiSDK,
    onSelectSong,
    initialArtist,
    initialTitle,
}: FindSongUsingSpotifyProps) => {
    const [results, setResults] = useState<Track[]>([]);
    const [search, setSearch] = useState(initialTitle || "");

    const [isSearchLoading, setIsSearchLoading] = useState(false);

    const debouncedSearch = useCallback(
        debounce(async (search: string) => {
            if (search.trim()) {
                setIsSearchLoading(true);

                const query = initialArtist
                    ? `${search} artist:${initialArtist}`
                    : search;

                const results = await apiSDK?.search(
                    query,
                    ["track"],
                    undefined,
                    3
                );
                if (!results) return;
                setResults(results.tracks.items);
                setIsSearchLoading(false);
            } else {
                setResults([]);
            }
        }, 500),
        [initialArtist, apiSDK]
    );

    const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        debouncedSearch(e.target.value);
    };

    const handleSelect = (track: Track) => {
        onSelectSong({ title: track.name, artist: track.artists[0].name });
        setSearch(track.name);
        setResults([]);
    };

    return (
        <div>
            <div>
                <Label>
                    Search{" "}
                    <span className="text-muted-foreground text-xs">
                        (Song name)
                    </span>
                </Label>
                <Input
                    onChange={handleInput}
                    value={search}
                    disabled={!apiSDK}
                />
            </div>
            <ul className="flex flex-col gap-3 pt-2">
                {results.map((track) => (
                    <li
                        key={track.id}
                        className="flex  flex-col  border p-2 hover:bg-secondary rounded-md cursor-pointer"
                        onClick={() => handleSelect(track)}
                    >
                        <div className="flex  gap-2">
                            <img
                                src={track.album.images[0].url}
                                alt={track.name}
                                className="size-8 rounded-md"
                            />

                            <div className="text-md font-bold">
                                {track.name}
                            </div>
                        </div>
                        <div className="flex  flex-wrap  items-baseline">
                            <span className="text-muted-foreground text-xs pr-1">
                                by
                            </span>
                            <div className=" text-sm">
                                {track.artists[0].name}
                            </div>
                            <div className="text-muted-foreground/80 text-xs">
                                {track.artists.slice(1).map((artist) => (
                                    <span key={artist.id}>, {artist.name}</span>
                                ))}
                            </div>
                        </div>
                    </li>
                ))}
                {isSearchLoading && (
                    <li className="w-full flex justify-center py-2">
                        <Loader2 className="size-4 animate-spin" />
                    </li>
                )}
            </ul>
        </div>
    );
};

export default FindSongUsingSpotify;

import { Input } from "@/components/ui/input"
import { ChangeEvent, useEffect, useMemo, useState } from "react"

import { Track } from "@spotify/web-api-ts-sdk"
import { debounce } from "lodash"
import { Loader2 } from "lucide-react"
import { Label } from "../ui/label"
import { useSpotifyWebSDKContext } from "@/components/spotify-new/providers/spotify-web-sdk-provider.tsx"

interface FindSongUsingSpotifyProps {
    onSelectSong: (track: Track) => void
    initialArtist?: string
    initialTitle?: string
}

const FindSongUsingSpotify = ({ onSelectSong, initialArtist, initialTitle }: FindSongUsingSpotifyProps) => {
    const [results, setResults] = useState<Track[]>([])
    const [search, setSearch] = useState("")

    const webSDK = useSpotifyWebSDKContext()

    useEffect(() => {
        setSearch((initialTitle ?? "") + " " + (initialArtist ?? ""))
    }, [initialArtist, initialTitle])

    const [isSearchLoading, setIsSearchLoading] = useState(false)

    // TODO : should this use useQuery?
    const debouncedSearch = useMemo(
        () =>
            debounce(async (search: string) => {
                const query = search.trim()
                if (query) {
                    setIsSearchLoading(true)

                    const results = await webSDK?.search(query, ["track"], undefined, 3)
                    if (!results) return
                    setResults(results.tracks.items)
                    setIsSearchLoading(false)
                } else {
                    setResults([])
                }
            }, 500),
        [webSDK]
    )

    const handleInput = async (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
        await debouncedSearch(e.target.value)
    }

    const handleSelect = (track: Track) => {
        onSelectSong(track)
        setSearch(track.name)
        setResults([])
    }

    useEffect(() => {
        return () => {
            debouncedSearch.cancel()
        }
    }, [debouncedSearch])

    return (
        <div>
            <div>
                <Label>
                    Search <span className="text-muted-foreground text-xs">(Song name)</span>
                </Label>
                <Input onChange={handleInput} value={search} disabled={!webSDK} onFocus={() => debouncedSearch(search)} />
            </div>
            <ul className="flex flex-col gap-3 pt-2">
                {results.map((track) => (
                    <li
                        key={track.id}
                        className="flex  flex-col  border p-2 hover:bg-secondary rounded-md cursor-pointer"
                        onClick={() => handleSelect(track)}
                    >
                        <div className="flex  gap-2">
                            <img src={track.album.images[0].url} alt={track.name} className="size-8 rounded-md" />

                            <div className="text-md font-bold">{track.name}</div>
                        </div>
                        <div className="flex  flex-wrap  items-baseline">
                            <span className="text-muted-foreground text-xs pr-1">by</span>
                            <div className=" text-sm">{track.artists[0].name}</div>
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
    )
}

export default FindSongUsingSpotify

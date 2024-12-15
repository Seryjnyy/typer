import KeyboardButton from "@/components/keyboard-button"
import BackButton from "@/components/ui/back-button"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SongBanner, SongHeader } from "@/components/ui/song-header"
import { Switch } from "@/components/ui/switch"
import { useSongStore } from "@/lib/store/song-store"
import { Song as SongType } from "@/lib/types"
import { cn, formatTimestamp } from "@/lib/utils"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { useSongCover } from "@/lib/hooks/use-song-cover"
import SongPopover from "./song-popover"
import { Icons } from "@/components/icons.tsx"
import PlayButton from "@/components/play-button.tsx"
import SpotifyFeatureGuard from "@/components/spotify/spotify-feature-guard.tsx"

interface SongContentProps {
    song: SongType
    verseMode: boolean
}

type Verse = { id: number; data: string }

const SomethingWentWrong = () => {
    return (
        <div className="flex justify-center items-center h-full flex-col gap-12">
            <div className="text-center">
                <h1 className="text-xl font-semibold">Sorry something went wrong.</h1>
                <p>The song might not exist anymore.</p>
            </div>
            <BackButton link="/songs" />
        </div>
    )
}

const SongContent = ({ song, verseMode }: SongContentProps) => {
    const [selected, setSelected] = useState<Verse[]>([])
    const navigate = useNavigate()

    const verses = song.content.split(/\n\s*\n/).map((verse, i) => ({ id: i, data: verse }))

    const onSelectVerse = (verse: Verse) => {
        if (!verseMode) return

        if (selected.find((x) => x.id == verse.id) != null) {
            // Remove
            setSelected((prev) => prev.filter((x) => x.id != verse.id))
        } else {
            // Add
            setSelected((prev) => [...prev, verse])
        }
    }

    const onResetSelected = () => {
        setSelected([])
    }

    const onTrySelected = () => {
        if (!verseMode) return

        navigate("/verse", {
            state: {
                content: selected.map((x) => x.data).reduce((prev, curr) => prev + "\n\n" + curr),
                id: song.id,
                cameFrom: `/songs/${song.id}`,
            },
        })
    }

    return (
        <pre className="font-sans sm:px-4 max-w-[calc(100vw-1rem)] text-wrap">
            {verseMode && (
                <div className="py-2 px-2 text-muted-foreground flex items-center justify-between  border-b mb-4">
                    <div className="flex items-center gap-2 text-sm">
                        <span>{selected.length} selected</span>
                        <Button size={"icon"} variant={"ghost"} onClick={onResetSelected}>
                            <ReloadIcon className="size-3" />
                        </Button>
                    </div>
                    <KeyboardButton onClick={onTrySelected} disabled={selected.length == 0} />
                </div>
            )}
            {verses.map((verse) => (
                <div key={verse.id}>
                    <div
                        className={cn(
                            " w-fit p-1 rounded-md ",
                            {
                                "hover:outline outline-primary cursor-pointer": verseMode,
                            },
                            {
                                "outline outline-primary": verseMode && selected.find((x) => x.id == verse.id) != null,
                            }
                        )}
                        onClick={() => onSelectVerse(verse)}
                    >
                        {verse.data}
                    </div>
                    <br />
                </div>
            ))}
        </pre>
    )
}

// TODO : on smaller screens text will be too long fix that
export default function Song() {
    const [verseMode, setVerseMode] = useState(false)
    const songs = useSongStore.use.songs()
    const { songID } = useParams()

    const song = useMemo(() => {
        return songs.find((x) => x.id == songID)
    }, [songs, songID])
    const { coverAsBgGradientStyle } = useSongCover(song)

    if (!songID) {
        throw Error("No song ID provided.")
    }
    // TODO : Could be better
    if (!song) return <SomethingWentWrong />

    return (
        <div className={` h-[100%]  overflow-hidden sm:rounded-md`}>
            <ScrollArea className={`h-[100%]  pb-2  flex flex-col relative `}>
                <div
                    className={`flex flex-col  items-start justify-start space-y-12 pt-12 w-full  px-2 sm:px-12`}
                    style={coverAsBgGradientStyle}
                >
                    <BackButton link="/songs" />
                    <div className="space-y-4 w-full">
                        <div>
                            <SongHeader>
                                <SongBanner song={song} size={"xl"} />
                                <div className="flex flex-col justify-center items-start px-8">
                                    <h1 className="text-2xl font-bold">{song.title}</h1>
                                    <div className={"flex items-center gap-2"}>
                                        {song.spotifyUri && <Icons.spotify className={"size-4 fill-white"} />}
                                        <p className="text-muted-foreground">{song.source}</p>
                                    </div>
                                </div>
                            </SongHeader>
                        </div>

                        <div className="flex items-end justify-between   w-full ">
                            <div className="flex gap-4 border border-dashed p-2 rounded-lg w-fit ">
                                <span className="text-xs text-muted-foreground">{song.record.accuracy}%</span>
                                <span className="text-xs text-muted-foreground">{song.record.wpm} chpm</span>
                                <span className="text-xs text-muted-foreground">{song.completion} completions</span>
                            </div>
                            {/* <div className="w-fit">
                                <Button
                                    size={"sm"}
                                    variant={"ghost"}
                                    className="space-x-2"
                                >
                                    <PlayIcon />
                                </Button>
                                <Button
                                    size={"sm"}
                                    variant={"ghost"}
                                    className="space-x-2"
                                >
                                    <PlusIcon />{" "}
                                    <span className="text-xs">Queue</span>
                                </Button>
                            </div> */}

                            <div className="flex gap-2  w-[9rem] items-center  justify-between">
                                <div className=" flex items-center gap-1 flex-col sm:flex-row">
                                    <Label htmlFor="verse-mode " className="text-xs text-muted-foreground">
                                        verse mode
                                    </Label>
                                    <Switch id="verse-mode" checked={verseMode} onCheckedChange={(val) => setVerseMode(val)} />
                                </div>
                                {/* <div className="w-fit">
                                    <Link to={"edit"}>
                                        <Button size={"icon"} variant={"ghost"}>
                                            <Pencil1Icon />
                                        </Button>
                                    </Link>
                                </div> */}

                                <SongPopover song={song} exclude={{ viewMore: true }} />
                            </div>
                        </div>
                        <div className="w-full flex justify-end">
                            {song.spotifyUri && (
                                <SpotifyFeatureGuard returnEnable={false}>
                                    <PlayButton
                                        songID={song.id}
                                        redirect={false}
                                        size={"sm"}
                                        variant={"outline"}
                                        className={"hover:bg-secondary" + " hover:text-secondary-foreground"}
                                    >
                                        <div className={"flex gap-2"}>
                                            <Icons.spotify className="size-4 fill-spotifyGreen  " /> Play
                                        </div>
                                    </PlayButton>
                                </SpotifyFeatureGuard>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-12 text-sm sm:text-md md:text-lg px-[1.75rem] sm:px-[4.25rem]">
                    <SongContent song={song} verseMode={verseMode} />
                </div>

                <div className="w-full px-[1.75rem] sm:px-[4.25rem] flex items-center pt-24 flex-wrap gap-2 sm:gap-4">
                    <div className="flex  text-muted-foreground gap-1">
                        <span className="text-xs opacity-70">created at: </span>
                        <span className="text-xs">{formatTimestamp(song.createdAt)}</span>
                    </div>
                    <div className="flex  text-muted-foreground gap-1">
                        <span className="text-xs opacity-70">last modified at:</span>
                        <span className="text-xs">{formatTimestamp(song.lastModifiedAt)}</span>
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}

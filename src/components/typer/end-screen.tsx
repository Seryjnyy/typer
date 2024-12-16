import { Button } from "@/components/ui/button"
import { SongBanner } from "@/components/ui/song-header"
import { useSongCover } from "@/lib/hooks/use-song-cover"
import { useQueueStore } from "@/lib/store/queue-store"
import { useSongStore } from "@/lib/store/song-store"
import { Song } from "@/lib/types"
import { calculateAccuracy, cn, wpm } from "@/lib/utils"
import { Cross1Icon, HamburgerMenuIcon, ReloadIcon, TrackNextIcon, TrackPreviousIcon } from "@radix-ui/react-icons"
import { ButtonHTMLAttributes, ReactNode, useState } from "react"
import { TextModificationOptions } from "@/lib/store/text-modifications-store.tsx"
import { TypingStats } from "@/components/typer/types.ts"
import { usePreferenceStore } from "@/lib/store/preferences-store.tsx"

interface QueueControlButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    song: Song | undefined
    controlType: "next" | "prev"
}

const QueueControlButton = ({ song, controlType, ...props }: QueueControlButtonProps) => {
    return (
        <Button variant={"ghost"} className="group flex gap-2 items-center rounded-none" disabled={song == null} {...props}>
            {controlType == "prev" ? <TrackPreviousIcon /> : <></>}
            <div className="flex flex-col max-w-[12rem] min-w-[2rem] pl-1">
                {song != null && (
                    <div className="flex gap-2 items-center">
                        <SongBanner song={song} size={"sm"} />
                        <div className="flex flex-col">
                            <span className="text-ellipsis overflow-hidden text-sm group-hover:text-accent-foreground">{song.title}</span>
                            <span className="text-muted-foreground text-xs text-ellipsis overflow-hidden group-hover:text-accent-foreground">
                                {song.source}
                            </span>
                        </div>
                    </div>
                )}
            </div>
            {controlType == "next" ? <TrackNextIcon /> : <></>}
        </Button>
    )
}

const EndScreenFooter = ({ onRestart, queueControlButtons }: { onRestart: () => void; queueControlButtons?: boolean }) => {
    const getSongData = useSongStore.use.getSongData()
    const getNextSong = useQueueStore.use.getNextSong()
    const getPrevSong = useQueueStore.use.getPrevSong()
    const next = useQueueStore.use.next()
    const prev = useQueueStore.use.prev()

    const prevSongID = getPrevSong()
    const prevSong = prevSongID ? getSongData(prevSongID) : undefined

    const nextSongID = getNextSong()
    const nextSong = nextSongID ? getSongData(nextSongID) : undefined

    return (
        <div className="sm:w-[22.5rem] md:w-[30rem] sm:flex sm:justify-between sm:flex-row border p-2 flex flex-col items-center gap-4 sm:gap-0 ">
            <div className="w-[12rem]  flex justify-start">
                {!queueControlButtons && <QueueControlButton song={prevSong} controlType="prev" onClick={prev} />}
            </div>

            <Button variant={"ghost"} size={"icon"} onClick={onRestart}>
                <ReloadIcon />
            </Button>

            <div className="w-[12rem]  flex justify-end">
                {!queueControlButtons && <QueueControlButton song={nextSong} controlType="next" onClick={next} />}
            </div>
        </div>
    )
}

const Stat = ({ title, value }: { title: string; value: string | number }) => {
    return (
        <div className="flex items-end">
            <span className="text-primary text-3xl font-semibold">{value}</span>
            <span className="text-muted-foreground text-xl">{title}</span>
        </div>
    )
}

const EndScreenTitle = ({ song, children }: { song: Song; children?: ReactNode }) => {
    return (
        <div className="text-center backdrop-brightness-50 rounded-sm p-2 ">
            <h2 className="text-6xl font-semibold">{song?.title}</h2>
            <span className="text-foreground/50 text-md">{song?.source}</span>
            {children}
        </div>
    )
}

const EndScreenStats = ({ stats, txtMods }: { stats: TypingStats & { time: number }; txtMods: TextModificationOptions }) => {
    const isTxtModUsed = Object.values(txtMods).some((mod) => mod !== "normal")

    return (
        <div className=" flex gap-6 flex-col items-center">
            <div className="flex gap-4 border  p-1 rounded-md px-2">
                <Stat title="ch" value={stats.current} />

                <Stat title="s" value={stats.time} />
                <div className="border-l  pl-2 flex gap-2">
                    <Stat title="wpm" value={stats.time == 0 ? stats.current : wpm(stats.current, stats.time)} />
                </div>
            </div>
            <div className="border p-1 rounded-md px-2 flex gap-4">
                <Stat title="correct" value={stats.correct} />
                <Stat title="incorrect" value={stats.incorrect} />
                <div className="border-l  pl-2    ">
                    <Stat title="acc" value={`${calculateAccuracy(stats.correct, stats.current)}%`} />
                </div>
                <div className="border-l pl-2">
                    <Stat title="errors" value={stats.errorMap.size} />
                </div>
            </div>
            {/*TODO : This should not appear in verse page, since stats will not be saved either way.*/}
            {isTxtModUsed && <span className="text-xs text-orange-400">*Text modifications are on, so stats will not be saved.</span>}
            {stats.skipLineUsed && <span className="text-xs text-orange-400">*You skipped lines, so stats will not be saved.</span>}
            <div>
                {txtMods.letterCase !== "normal" && <span className="text-xs text-accent-foreground">*Letter case is on</span>}
                {txtMods.punctuation !== "normal" && <span className="text-xs text-accent-foreground">*Punctuation is on</span>}
                {txtMods.numbers !== "normal" && <span className="text-xs text-accent-foreground">*Numbers is on</span>}
            </div>
        </div>
    )
}

function EndScreen({ isOpenInitially, song, children }: { isOpenInitially?: boolean; song: Song; children: ReactNode }) {
    const [open, setOpen] = useState(isOpenInitially ?? true)
    const { coverAsBgGradientStyle } = useSongCover(song)

    return (
        <div
            className={cn(
                "absolute w-[98%] h-[70vh] sm:h-[calc(100vh-10rem)] backdrop-blur-lg border   flex justify-center right-[1%] top-2 z-[300]   rounded-md ",
                { "max-h-9 w-9 border-none": !open }
            )}
            style={coverAsBgGradientStyle}
        >
            <div className="w-full h-full relative  ">
                <Button
                    className={cn("absolute right-0 top-0 rounded-l-none rounded-tr-xl", open ? "rounded-br-none" : "rounded-xl border")}
                    variant={"ghost"}
                    size={"icon"}
                    onClick={() => setOpen((prev) => !prev)}
                >
                    {open ? <Cross1Icon /> : <HamburgerMenuIcon />}
                </Button>
                {open && <div className="flex flex-col  justify-between items-center h-full p-8 ">{children}</div>}
            </div>
        </div>
    )
}

interface EndScreenProps {
    onRestart: () => void
    isOpenInitially?: boolean
    song: Song
    stats: TypingStats & { time: number }
    textModificationsUsed: TextModificationOptions
}

export const VerseEndScreen = ({ onRestart, stats, song, textModificationsUsed }: EndScreenProps) => {
    const isOpenInitially = usePreferenceStore.use.isOpenEndScreenInitially()
    return (
        <EndScreen song={song} isOpenInitially={isOpenInitially}>
            <EndScreenTitle song={song}>
                <span className="block text-foreground/40">-verse mode-</span>
            </EndScreenTitle>
            <EndScreenStats stats={stats} txtMods={textModificationsUsed} />
            <EndScreenFooter onRestart={onRestart} queueControlButtons={false} />
        </EndScreen>
    )
}

export const NormalEndScreen = ({ onRestart, stats, song, textModificationsUsed }: EndScreenProps) => {
    const isOpenInitially = usePreferenceStore.use.isOpenEndScreenInitiallyVersePage()
    return (
        <EndScreen song={song} isOpenInitially={isOpenInitially}>
            <EndScreenTitle song={song} />
            <EndScreenStats stats={stats} txtMods={textModificationsUsed} />
            <EndScreenFooter onRestart={onRestart} queueControlButtons={true} />
        </EndScreen>
    )
}

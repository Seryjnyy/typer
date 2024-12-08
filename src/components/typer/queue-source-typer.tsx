import { useNavigate } from "react-router-dom"
import { useSongStore } from "@/lib/store/song-store.tsx"
import NoSongSelected from "@/components/typer/no-song-selected.tsx"
import { Song } from "@/lib/types.ts"
import { GameState, TypingStats } from "@/components/typer/types.ts"
import { calculateAccuracy, cn, wpm } from "@/lib/utils.ts"
import FlatDisplay from "@/components/typer/flat-display.tsx"
import { NormalEndScreen } from "@/components/typer/end-screen.tsx"
import { SongProviderForTyper } from "@/components/typer/typer.tsx"
import { useQueueStore } from "@/lib/store/queue-store.tsx"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"
import { useCurrentSong } from "@/components/typer/use-current-song.ts"
import CylinderDisplay from "@/components/typer/cylinder-display.tsx"
import { usePreferenceStore } from "@/lib/store/preferences-store.tsx"

export default function QueueSourceTyper() {
    const currentSong = useCurrentSong()
    const navigate = useNavigate()
    const typerDisplayFormat = usePreferenceStore.use.typerTextDisplay()
    const editSongCompletion = useSongStore.use.editSongCompletion()
    const editSongRecord = useSongStore.use.editSongRecord()

    if (!currentSong)
        return (
            <div className={"flex items-center h-full "}>
                <NoSongSelected />
            </div>
        )

    // Only save if txt mods not used
    const saveStats = (source: Song, stats: TypingStats & { time: number }) => {
        editSongCompletion(source.id, source.completion + 1)

        const wpmRes = wpm(stats.time > 0 ? stats.time : 1, stats.current)
        const accRes = calculateAccuracy(stats.correct, stats.current)

        editSongRecord(source.id, {
            wpm: wpmRes,
            accuracy: accRes,
        })
    }

    return (
        <div className={cn("h-[calc(100vh-5rem)] w-full flex overflow-hidden rounded-md  ")}>
            <SongProviderForTyper
                sourceID={currentSong.id}
                content={currentSong.content}
                renderDisplay={(props) => {
                    if (typerDisplayFormat === "cylinder") {
                        return (
                            <CylinderDisplay
                                {...props}
                                tryVerse={(verse) => {
                                    navigate("verse", {
                                        state: {
                                            id: props.source.id,
                                            content: verse,
                                            cameFrom: "/",
                                        },
                                    })
                                }}
                            />
                        )
                    } else {
                        return (
                            <FlatDisplay
                                {...props}
                                tryVerse={(verse) => {
                                    navigate("verse", {
                                        state: {
                                            id: props.source.id,
                                            content: verse,
                                            cameFrom: "/",
                                        },
                                    })
                                }}
                            />
                        )
                    }
                }}
                renderWhenComplete={({ gameState, stats, difficultyModsUsed, handleRestart, source, time }) => (
                    <>
                        <NormalEndScreen
                            song={source}
                            stats={{ ...stats, time }}
                            onRestart={handleRestart}
                            textModificationsUsed={difficultyModsUsed}
                        />
                        <AutoPlay gameState={gameState} />
                    </>
                )}
                onCompletion={({ stats, textMods, source }) => {
                    const isTxtModUsed = Object.values(textMods).some((mod) => mod !== "normal")
                    if (isTxtModUsed) return
                    saveStats(source, stats)
                }}
            />
        </div>
    )
}

const AutoPlay = ({ gameState }: { gameState: GameState }) => {
    const isAutoplay = useQueueStore.use.autoplay()
    const getNextSong = useQueueStore.use.getNextSong()
    const next = useQueueStore.use.next()

    useEffect(() => {
        if (gameState !== "completed" || !isAutoplay) return

        const timeOut = setTimeout(() => {
            next()
        }, 2000)

        return () => clearTimeout(timeOut)
    }, [gameState, isAutoplay, next])

    if (gameState !== "completed" || !isAutoplay) return null

    return (
        <div
            className={cn(
                "absolute flex text-xs opacity-0 text-muted-foreground items-center gap-2 bottom-6 left-[50%] -translate-x-[50%] translate-y-[75%]  px-2 backdrop-blur-xl  rounded-sm py-0 ",
                {
                    "animate-playingNextSong": gameState === "completed",
                }
            )}
        >
            {getNextSong() ? (
                <>
                    <span>Playing next song</span>
                    <Loader2 className="animate-spin size-3" />
                </>
            ) : (
                <span>End of queue</span>
            )}
        </div>
    )
}

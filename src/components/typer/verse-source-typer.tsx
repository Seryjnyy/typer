import { Button } from "@/components/ui/button.tsx"
import { SongBanner } from "@/components/ui/song-header.tsx"
import { ArrowLeftIcon } from "@radix-ui/react-icons"
import { useLocation } from "react-router"
import { Link } from "react-router-dom"
import BackButton from "@/components/ui/back-button.tsx"
import { Song } from "@/lib/types.ts"
import { SongProviderForTyper } from "@/components/typer/typer.tsx"
import FlatDisplay from "@/components/typer/flat-display.tsx"
import { VerseEndScreen } from "@/components/typer/end-screen.tsx"
import CylinderDisplay from "@/components/typer/cylinder-display.tsx"
import { usePreferenceStore } from "@/lib/store/preferences-store.tsx"

const SomethingWentWrong = () => {
    return (
        <div className="flex justify-center items-center h-full flex-col gap-12">
            <div className="text-center">
                <h1 className="text-xl font-semibold">Sorry something went wrong.</h1>
                <p>Please go back and try again.</p>
            </div>
            <BackButton link="/" />
        </div>
    )
}

interface TopProps {
    cameFrom: string
    song?: Song
}
const Top = ({ song, cameFrom }: TopProps) => {
    return (
        <div className="absolute top-0 left-0 text-xs z-40 flex items-center gap-2 text-muted-foreground">
            <Link to={cameFrom != null ? cameFrom : "/"}>
                <Button size={"sm"} className="group rounded-none sm:rounded-tl-md " variant={"ghost"}>
                    <span className="flex gap-1 backdrop-blur-sm px-1 rounded-sm">
                        <ArrowLeftIcon className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back</span>
                    </span>
                </Button>
            </Link>
            <div className="flex gap-1 backdrop-blur-sm rounded-sm pr-1 items-center">
                {song && <SongBanner song={song} size={"xs"} className="rounded-[2px]" />}
                <span className="overflow-hidden text-nowrap text-ellipsis max-w-[5rem] sm:max-w-[15rem]">{song?.title}</span>
                <span>-</span>
                <span className="overflow-hidden text-nowrap text-ellipsis max-w-[5rem] sm:max-w-[15rem] opacity-70">{song?.source}</span>
            </div>
        </div>
    )
}

export default function VerseSourceTyper() {
    const typerDisplayFormat = usePreferenceStore.use.verseTyperTextDisplay()
    const { state } = useLocation()
    const { content, id, cameFrom } = state
        ? (state as { content: string; id: string; cameFrom: string })
        : { content: undefined, id: undefined, cameFrom: undefined }

    if (state == undefined || content == undefined || id == undefined || cameFrom == undefined) return <SomethingWentWrong />

    return (
        <SongProviderForTyper
            sourceID={id}
            content={content}
            renderDisplay={(props) => {
                if (typerDisplayFormat === "cylinder") {
                    return <CylinderDisplay {...props} />
                } else {
                    return <FlatDisplay {...props} />
                }
            }}
            renderDecorations={(props) => <Top song={props.source} cameFrom={cameFrom} />}
            renderWhenComplete={({ stats, difficultyModsUsed, handleRestart, source, time }) => (
                <>
                    <VerseEndScreen
                        song={source}
                        stats={{ ...stats, time }}
                        onRestart={handleRestart}
                        textModificationsUsed={difficultyModsUsed}
                    />
                </>
            )}
        />
    )
}

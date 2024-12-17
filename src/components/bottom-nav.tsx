import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { CaretDownIcon, CaretUpIcon, PlayIcon } from "@radix-ui/react-icons"
import { useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useQueueStore } from "../lib/store/queue-store"
import { useSongStore } from "../lib/store/song-store"
import { useUiStateStore } from "../lib/store/ui-state-store"
import { cn } from "../lib/utils"
import LoopButton from "./loop-button"
import { MobileQueue } from "./queue"
import QueueControl from "./queue-control"
import ShuffleButton from "./shuffle-button"
import { Button } from "./ui/button"
import { SongBanner, SongDetail, SongHeader } from "./ui/song-header"
import WindowControls from "./window-controls"
import usePlaySong from "@/lib/hooks/use-play-song"
import { useSongProgress } from "@/components/typer/progress-state.ts"

const MediaControl = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const current = useQueueStore.use.current()
    const playSong = usePlaySong()

    const songs = useQueueStore.use.songs()

    // TODO : might need to force rerender window
    const onPlaySong = () => {
        // Route to typer if not on typer page
        if (location.pathname != "/") {
            navigate("/")
        }

        if (!current && songs.length > 0) {
            playSong(songs[0])
        }
    }

    return (
        <div className="flex items-center gap-3">
            <ShuffleButton variant={"ghost"} size={"icon"} disabled={songs.length == 0} />
            <QueueControl>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button onClick={onPlaySong} size={"icon"} className="rounded-full w-11 h-11" disabled={songs.length == 0}>
                            <PlayIcon className="size-6" />
                        </Button>
                    </TooltipTrigger>

                    <TooltipContent>
                        <p>Play</p>
                    </TooltipContent>
                </Tooltip>
            </QueueControl>
            <LoopButton />
        </div>
    )
}

const SongInfo = () => {
    const current = useQueueStore.use.current()
    const songList = useSongStore.use.songs()

    const songData = useMemo(() => {
        return songList.find((x) => x.id == current)
    }, [current, songList])

    return (
        <div className="flex flex-col max-w-[12rem]">
            {songData && (
                <SongHeader>
                    <SongBanner song={songData} playButton />
                    <SongDetail length={"long"} song={songData} isCurrent={songData.id == current} />
                </SongHeader>
            )}
        </div>
    )
}

const MobileMenu = ({ className }: { className?: string }) => {
    const setQueueWindowOpen = useUiStateStore.use.setQueueWindowOpen()

    const focus = useUiStateStore.use.focus()

    const [songProgress] = useSongProgress()
    const [openQueue, setOpenQueue] = useState(false)

    const onToggleQueueWindow = (val: boolean) => {
        setQueueWindowOpen(val)
    }

    if (focus) return null

    return (
        <div className={cn("w-full  flex flex-col justify-start   h-full bg-background", className)}>
            <div className={cn("w-full relative h-full ")}>
                <div className={`h-14 w-full absolute -top-16 left-0 backdrop-blur-xl`}>
                    <Drawer>
                        <DrawerTrigger className="w-full h-full px-2 flex items-center justify-between border-y " asChild>
                            <div>
                                <div className="w-fit flex gap-2 md:gap-9">
                                    <SongInfo />
                                </div>
                                {/* <div className="w-[10rem]">
                                <Progress
                                    value={
                                        (songTypedChar / songTotalChar) * 100
                                    }
                                    className="w-full h-1"
                                />
                            </div> */}
                                <CaretUpIcon />
                            </div>
                        </DrawerTrigger>

                        <DrawerContent>
                            <div
                                className={cn(
                                    "flex flex-col  transition-all overflow-hidden  ease-in-out duration-500",
                                    // from && `bg-gradient-to-b ${from} `,
                                    openQueue ? "max-h-[90vh] h-[90vh]" : "max-h-[50vh] h-[50vh]"
                                )}
                            >
                                <DrawerHeader>
                                    <DrawerTitle className="sr-only">Media controls and queue drawer.</DrawerTitle>
                                    <DrawerDescription className="sr-only">
                                        This is where you can control the media with play, prev and next buttons. This is also where the
                                        queue is.
                                    </DrawerDescription>
                                </DrawerHeader>

                                <div className="space-y-2 mt-auto backdrop-brightness-50 pt-4 rounded-t-md">
                                    <div className="mx-2 sm:mx-12">
                                        <div className="w-fit flex md:gap-9">
                                            <SongInfo />
                                        </div>
                                    </div>
                                    <div className="flex justify-center flex-col items-center gap-4 px-2 sm:mx-12">
                                        <Progress value={songProgress} className="w-full h-1" />
                                        <MediaControl />
                                    </div>

                                    <Collapsible
                                        open={openQueue}
                                        onOpenChange={(val) => {
                                            setOpenQueue(val)
                                            onToggleQueueWindow(!val)
                                        }}
                                    >
                                        <CollapsibleTrigger className="flex justify-between items-center w-full px-2 py-2 text-sm font-medium [&[data-state=open]>svg]:rotate-180  transition-all">
                                            <span>Open queue</span>
                                            <CaretUpIcon className="text-muted-foreground w-6 h-6 transition-transform duration-200" />
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="h-[53vh] overflow-hidden data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown duration-500 ">
                                            {/*TODO : the entire queue is rendered here even when the mobile menu is closed, same with
                                                normal queue when not in mobile. I think at least, collapsible might render only when
                                                 opened. Also maybe memo the queue.*/}
                                            <MobileQueue />
                                        </CollapsibleContent>
                                    </Collapsible>
                                </div>
                            </div>
                        </DrawerContent>
                    </Drawer>
                </div>

                <div className="w-full h-full">
                    <WindowControls variant={"square"} />
                </div>
            </div>
        </div>
    )
}

// TODO : conditionally render mobile/pc menu
export default function BottomNav() {
    const queueWindowOpen = useUiStateStore.use.queueWindowOpen()
    const focus = useUiStateStore.use.focus()
    const setQueueWindowOpen = useUiStateStore.use.setQueueWindowOpen()

    const [songProgress] = useSongProgress()

    const onToggleQueueWindow = () => {
        setQueueWindowOpen(!queueWindowOpen)
    }

    if (focus) return null

    return (
        <div className="h-full">
            <MobileMenu className=" sm:hidden " />
            <div className="w-full flex-col justify-start   h-full hidden sm:flex ">
                <Progress value={songProgress} className="w-full h-1" />

                <div className="px-3 h-full grid-cols-3 grid w-full bg-background  pt-1 ">
                    <div className="w-fit flex gap-9">
                        <SongInfo />
                    </div>
                    <div className="flex items-center gap-2 h-full  justify-center flex-col">
                        <MediaControl />
                    </div>

                    <div className="flex gap-8 items-center  justify-end ">
                        <div className="w-[7rem] h-[2rem]">
                            <WindowControls />
                        </div>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size={"icon"} onClick={onToggleQueueWindow} variant={"ghost"}>
                                    {queueWindowOpen ? <CaretDownIcon /> : <CaretUpIcon />}
                                </Button>
                            </TooltipTrigger>

                            <TooltipContent>
                                <p>{queueWindowOpen ? "Close queue" : "Open queue"}</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </div>
    )
}

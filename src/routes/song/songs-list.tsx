import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Cross1Icon,
    ListBulletIcon,
    MagnifyingGlassIcon,
    MixerHorizontalIcon,
    PlusIcon,
    TextAlignCenterIcon,
    TrashIcon,
} from "@radix-ui/react-icons"
import { Button } from "../../components/ui/button"
import { SongBanner, SongDetail, SongHeader } from "../../components/ui/song-header"

import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ReactNode, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ScrollArea } from "../../components/ui/scroll-area"
import { useQueueStore } from "../../lib/store/queue-store"
import { useSongStore } from "../../lib/store/song-store"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ListStyle, Order, Song, SortBy } from "@/lib/types"
import SongPopover from "./song-popover"
import { usePreferenceStore } from "@/lib/store/preferences-store"
import { useUiStateStore } from "@/lib/store/ui-state-store"
import useScreenSize from "@/lib/hooks/use-screen-size"

const sortSongs = (songs: Song[], order: Order, sort: SortBy) => {
    switch (sort) {
        case "title":
            return songs.sort((a, b) => {
                if (order === "asc") {
                    return a.title.localeCompare(b.title)
                } else {
                    return b.title.localeCompare(a.title)
                }
            })
        case "source":
            return songs.sort((a, b) => {
                if (order === "asc") {
                    return a.source.localeCompare(b.title)
                } else {
                    return b.source.localeCompare(a.title)
                }
            })
        case "completions":
            return songs.sort((a, b) => {
                if (order === "asc") {
                    return a.completion - b.completion
                } else {
                    return b.completion - a.completion
                }
            })
        case "length":
            return songs.sort((a, b) => {
                if (order === "asc") {
                    return a.content.length - b.content.length
                } else {
                    return b.content.length - a.content.length
                }
            })
        case "created":
            return songs.sort((a, b) => {
                if (order === "asc") {
                    return a.createdAt - b.createdAt
                } else {
                    return b.createdAt - a.createdAt
                }
            })
        case "modified":
            return songs.sort((a, b) => {
                if (order === "asc") {
                    return a.lastModifiedAt - b.lastModifiedAt
                } else {
                    return b.lastModifiedAt - a.lastModifiedAt
                }
            })

        default:
            return songs
    }
}

const SongLyricHoverCard = ({ song }: { song: Song }) => {
    return (
        <HoverCard openDelay={500} closeDelay={0}>
            <HoverCardTrigger className="hidden md:block p-2" onClick={(e) => e.stopPropagation()}>
                <TextAlignCenterIcon />
            </HoverCardTrigger>
            <HoverCardContent className="w-fit text-xs max-h-[20rem] overflow-hidden" side="bottom" align={"end"}>
                <span className="text-muted-foreground font-bold">Lyrics</span>
                <pre>
                    {song.content.slice(0, 256)}
                    {song.content.length > 256 && "..."}
                </pre>
            </HoverCardContent>
        </HoverCard>
    )
}

const SongStats = ({ song }: { song: Song }) => {
    const isQueueWindowOpen = useUiStateStore.use.queueWindowOpen()
    const songListStylePref = usePreferenceStore.use.songList()
    const { isLg } = useScreenSize()

    if (isQueueWindowOpen && !isLg) return null

    return (
        <div
            className={" gap-4   p-2 rounded-lg hidden sm:flex" + (songListStylePref.listStyle == "list" ? "border border-dashed" : "")}
            onClick={(e) => e.stopPropagation()}
        >
            <span className="text-xs text-muted-foreground border-r pr-3">{song.content.length} ch</span>
            <span className="text-xs text-muted-foreground">{song.record.accuracy}%</span>
            <span className="text-xs text-muted-foreground">{song.record.wpm} wpm</span>
            <span className="text-xs text-muted-foreground">{song.completion} completions</span>
        </div>
    )
}

type SongItemExclude = { deleteButton: boolean }

const SongItem = ({
    song,
    index,
    listStyle,
    exclude,
    buttonRender,
    popoverDestructiveRender,
}: {
    song: Song
    index: number
    listStyle: ListStyle
    exclude?: SongItemExclude
    buttonRender?: (song: Song) => ReactNode
    popoverDestructiveRender?: (song: Song) => ReactNode
}) => {
    const removeSong = useSongStore.use.removeSong()

    const currentSong = useQueueStore.use.current()
    const enqueue = useQueueStore.use.enqueue()
    // const queueNext = useQueueStore.use.queueNext()

    const navigate = useNavigate()

    const onAddToQueue = (songId: string) => {
        enqueue(songId)
    }

    if (listStyle == "compact") {
        return (
            <div
                className="border py-1 px-4 group hover:bg-secondary rounded-md flex justify-between items-center "
                onClick={() => navigate(`/songs/${song.id}`)}
            >
                <div className="flex gap-4 items-center">
                    <div className="text-muted group-hover:text-foreground text-xs sm:text-md" onClick={(e) => e.stopPropagation()}>
                        {index + 1}
                    </div>
                    <div className=" gap-3 flex justify-between text-xs sm:text-sm items-center" onClick={(e) => e.stopPropagation()}>
                        <span className="font-semibold  text-ellipsis overflow-hidden whitespace-nowrap">{song.title}</span>
                        <span className="text-muted-foreground hidden sm:block">-</span>
                        <span className="text-muted-foreground">{song.source}</span>
                    </div>
                </div>

                <div className="flex gap-1 items-center">
                    <SongLyricHoverCard song={song} />
                    <SongStats song={song} />
                    <SongPopover song={song} />
                </div>
            </div>
        )
    }

    return (
        <div
            className="border p-4  group hover:bg-secondary rounded-md flex justify-between items-center "
            key={song.id}
            onClick={() => navigate(`/songs/${song.id}`)}
        >
            <div className="flex gap-4 items-center ">
                <div className="text-muted group-hover:text-foreground " onClick={(e) => e.stopPropagation()}>
                    {index + 1}
                </div>
                <SongHeader>
                    <SongBanner song={song} onClick={(e) => e.stopPropagation()} playButton />
                    <SongDetail
                        length={"extra-long"}
                        className="pl-3"
                        song={song}
                        isCurrent={song.id == currentSong}
                        onClick={(e) => e.stopPropagation()}
                    />
                </SongHeader>
            </div>

            <div className="flex justify-between items-center gap-4">
                <div className="flex items-center  justify-between">
                    <SongLyricHoverCard song={song} />
                    <SongStats song={song} />
                </div>
                <div className="gap-1 hidden lg:flex">
                    <Button
                        className="gap-1"
                        size={"sm"}
                        onClick={(e) => {
                            e.stopPropagation()
                            onAddToQueue(song.id)
                        }}
                        variant={"outline"}
                    >
                        <PlusIcon />
                        <span> Queue</span>
                    </Button>
                    {buttonRender?.(song)}
                    {!exclude?.deleteButton ? (
                        <AlertDialog>
                            <AlertDialogTrigger
                                asChild
                                onClick={(e) => {
                                    e.stopPropagation()
                                }}
                            >
                                <Button variant={"destructive"} size={"sm"}>
                                    <TrashIcon />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the song.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            removeSong(song.id)
                                            navigate("/songs")
                                        }}
                                    >
                                        Continue
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    ) : null}
                </div>
                <SongPopover song={song} destructiveMenuItems={popoverDestructiveRender?.(song)} />
            </div>
        </div>
    )
}

const ResponsiveCount = ({ currentCount, totalCount }: { currentCount: number; totalCount: number }) => {
    return (
        <div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger className="cursor-default">
                        <span className="text-xs  items-center text-muted-foreground font-thin  pr-2">
                            {currentCount}/{totalCount}
                        </span>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        <p>Song count</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}

interface SongsListProps {
    songsList: Song[]
    exclude?: SongItemExclude
    listItemButtonRender?: (song: Song) => ReactNode
    listItemPopoverDestructiveRender?: (song: Song) => ReactNode
}

const SongsList = ({ songsList, exclude, listItemPopoverDestructiveRender, listItemButtonRender }: SongsListProps) => {
    // TODO : Include song content in the search
    // TODO : Highlight the section that was searched for and found, this includes some element to show it was found in lyrics
    const [searchTerm, setSearchTerm] = useState("")

    const songListPreferences = usePreferenceStore.use.songList()
    const setSongListPreferences = usePreferenceStore.use.setSongListPref()

    const lowerCaseSearchTerm = searchTerm.toLocaleLowerCase()

    const filteredAndSortedSongs = useMemo(() => {
        return sortSongs(songsList, songListPreferences.order, songListPreferences.sortBy).filter(
            (song) =>
                song.title.toLocaleLowerCase().includes(lowerCaseSearchTerm) ||
                song.source.toLocaleLowerCase().includes(lowerCaseSearchTerm)
        )
    }, [songsList, songListPreferences, lowerCaseSearchTerm])

    const listStyleOptions = ["list", "compact"]
    const sortOrderOptions = ["asc", "desc"]
    const sortByOptions = ["title", "source", "length", "completions", "created", "modified"]

    const onChangeSortOrder = (val: string) => {
        if (val != "asc" && val != "desc") return

        setSongListPreferences({ ...songListPreferences, order: val })
    }

    const onChangeSortBy = (val: string) => {
        if (val != "title" && val != "source" && val != "length" && val != "modified" && val != "created" && val != "completions") return

        setSongListPreferences({ ...songListPreferences, sortBy: val })
    }

    const onChangeListStyle = (val: string) => {
        if (val != "list" && val != "compact") return

        setSongListPreferences({ ...songListPreferences, listStyle: val })
    }

    const isSortNotStandard = songListPreferences.sortBy != "created" || songListPreferences.order != "asc"

    return (
        <>
            <div className=" h-full ">
                <div className=" items-center gap-6 hidden sm:flex justify-between py-3  px-6">
                    <ResponsiveCount currentCount={filteredAndSortedSongs.length} totalCount={songsList.length} />

                    <div className="flex items-center gap-8 pl-6">
                        <div>
                            <Popover>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <PopoverTrigger>
                                                <ListBulletIcon
                                                    className={songListPreferences.listStyle == "compact" ? "text-primary" : ""}
                                                />
                                            </PopoverTrigger>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom">
                                            <p>List style</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <PopoverContent className="space-y-2 w-fit">
                                    <ToggleGroup
                                        value={songListPreferences.listStyle}
                                        onValueChange={(val) => onChangeListStyle(val)}
                                        type="single"
                                        orientation="vertical"
                                        className="flex flex-col"
                                    >
                                        {listStyleOptions.map((option) => (
                                            <ToggleGroupItem
                                                key={option}
                                                value={option}
                                                aria-label={`Toggle ${option} style`}
                                                className="capitalize w-full "
                                            >
                                                <span className="mr-auto">{option}</span>
                                            </ToggleGroupItem>
                                        ))}
                                    </ToggleGroup>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div>
                            <Popover>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <PopoverTrigger>
                                                <MixerHorizontalIcon className={isSortNotStandard ? "text-primary" : ""} />
                                            </PopoverTrigger>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom">
                                            <p>Sort</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <PopoverContent className="space-y-2 w-fit">
                                    <ToggleGroup
                                        value={songListPreferences.sortBy}
                                        onValueChange={(val) => onChangeSortBy(val)}
                                        type="single"
                                        orientation="vertical"
                                        className="flex flex-col items-start"
                                    >
                                        {sortByOptions.map((option) => (
                                            <ToggleGroupItem
                                                key={option}
                                                value={option}
                                                aria-label={`Toggle sort by ${option}`}
                                                className="capitalize w-full "
                                            >
                                                <span className="mr-auto">{option}</span>
                                            </ToggleGroupItem>
                                        ))}
                                    </ToggleGroup>

                                    <ToggleGroup
                                        value={songListPreferences.order}
                                        onValueChange={(val) => onChangeSortOrder(val)}
                                        type="single"
                                        orientation="vertical"
                                        className="flex flex-col border-t pt-2"
                                    >
                                        {sortOrderOptions.map((option) => (
                                            <ToggleGroupItem
                                                key={option}
                                                value={option}
                                                aria-label={`Toggle sort order ${option}`}
                                                className="capitalize w-full "
                                            >
                                                <span className="mr-auto">{option}</span>
                                            </ToggleGroupItem>
                                        ))}
                                    </ToggleGroup>
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="flex items-center gap-1 ">
                            <MagnifyingGlassIcon className={searchTerm.length > 0 ? "text-primary" : ""} />

                            <div className="relative">
                                <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                {searchTerm.length != 0 && (
                                    <Button
                                        size={"icon"}
                                        variant={"ghost"}
                                        onClick={() => setSearchTerm("")}
                                        className="absolute -right-10 top-0"
                                    >
                                        <Cross1Icon />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-8 sm:hidden justify-between py-3 px-3 border-b">
                    <ResponsiveCount currentCount={filteredAndSortedSongs.length} totalCount={songsList.length} />
                    <div className="flex gap-8">
                        <Popover>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <PopoverTrigger>
                                            <ListBulletIcon className={songListPreferences.listStyle == "compact" ? "text-primary" : ""} />
                                        </PopoverTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom">
                                        <p>List style</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <PopoverContent className="space-y-2 w-fit">
                                <ToggleGroup
                                    value={songListPreferences.listStyle}
                                    onValueChange={(val) => onChangeListStyle(val)}
                                    type="single"
                                    orientation="vertical"
                                    className="flex flex-col"
                                >
                                    {listStyleOptions.map((option) => (
                                        <ToggleGroupItem
                                            key={option}
                                            value={option}
                                            aria-label={`Toggle ${option} style`}
                                            className="capitalize w-full "
                                        >
                                            <span className="mr-auto">{option}</span>
                                        </ToggleGroupItem>
                                    ))}
                                </ToggleGroup>
                            </PopoverContent>
                        </Popover>
                        <Drawer>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DrawerTrigger>
                                            <MixerHorizontalIcon
                                                className={searchTerm.length > 0 || isSortNotStandard ? "text-primary" : ""}
                                            />
                                        </DrawerTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom">
                                        <p>Search and sort</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <DrawerContent className="h-[70vh] px-10">
                                <DrawerHeader>
                                    <DrawerTitle className="sr-only">Search for songs or change how songs are sorted.</DrawerTitle>
                                    <DrawerDescription className="sr-only">Sort of search.</DrawerDescription>
                                </DrawerHeader>
                                <div className="flex flex-col justify-between h-full px-2 pt-2 pb-6">
                                    <div>
                                        <h2 className="text-center text-lg font-semibold pb-2">Search</h2>
                                        <div className="flex items-center gap-1 ">
                                            <MagnifyingGlassIcon className={searchTerm.length > 0 ? "text-primary" : ""} />

                                            <div className="relative w-full">
                                                <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                                {searchTerm.length != 0 && (
                                                    <Button
                                                        size={"icon"}
                                                        variant={"ghost"}
                                                        onClick={() => setSearchTerm("")}
                                                        className="absolute -right-10 top-0"
                                                    >
                                                        <Cross1Icon />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            <h2 className="text-center text-lg font-semibold pb-2">Sort</h2>
                                            <ToggleGroup
                                                value={songListPreferences.sortBy}
                                                onValueChange={(val) => onChangeSortBy(val)}
                                                type="single"
                                                orientation="vertical"
                                                className="flex flex-col items-start"
                                            >
                                                {sortByOptions.map((option) => (
                                                    <ToggleGroupItem
                                                        key={option}
                                                        value={option}
                                                        aria-label={`Toggle sort by ${option}`}
                                                        className="capitalize w-full "
                                                    >
                                                        <span className="mr-auto">{option}</span>
                                                    </ToggleGroupItem>
                                                ))}
                                            </ToggleGroup>

                                            <ToggleGroup
                                                value={songListPreferences.order}
                                                onValueChange={(val) => onChangeSortOrder(val)}
                                                type="single"
                                                orientation="vertical"
                                                className="flex flex-col border-t pt-2"
                                            >
                                                {sortOrderOptions.map((option) => (
                                                    <ToggleGroupItem
                                                        key={option}
                                                        value={option}
                                                        aria-label={`Toggle sort order ${option}`}
                                                        className="capitalize w-full "
                                                    >
                                                        <span className="mr-auto">{option}</span>
                                                    </ToggleGroupItem>
                                                ))}
                                            </ToggleGroup>
                                        </div>
                                    </div>
                                </div>
                            </DrawerContent>
                        </Drawer>
                    </div>
                </div>
                {/* <Button>Add all to queue</Button> */}
                <ScrollArea className="h-[calc(100%-3.8rem)] pr-3 mt-1 pb-1">
                    {/* <div className="space-y-2  pr-2"> */}
                    <div className="flex flex-col gap-2 ">
                        {filteredAndSortedSongs.length > 0 &&
                            filteredAndSortedSongs.map((song, index) => (
                                <SongItem
                                    exclude={exclude}
                                    buttonRender={(song) => listItemButtonRender?.(song)}
                                    popoverDestructiveRender={(song) => listItemPopoverDestructiveRender?.(song)}
                                    key={song.id}
                                    song={song}
                                    index={index}
                                    listStyle={songListPreferences.listStyle}
                                />
                            ))}
                        {songsList.length > 0 && filteredAndSortedSongs.length == 0 && (
                            <div className="w-full flex items-center justify-center mt-12">
                                <div className="flex flex-col text-center">
                                    <h3 className="font-semibold text-2xl">No results found</h3>
                                    <span className="text-muted-foreground ">Couldn't find what you searched for.</span>
                                </div>
                            </div>
                        )}
                        {songsList.length == 0 && (
                            <div className="w-full flex items-center justify-center mt-12">
                                <div className="flex flex-col text-center">
                                    <h3 className="font-semibold text-2xl">You don't have any songs</h3>
                                    <span className="text-muted-foreground ">Add some.</span>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* </div> */}
                </ScrollArea>
            </div>
        </>
    )
}

export default SongsList

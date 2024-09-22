import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

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
} from "@/components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Cross1Icon,
    DotsHorizontalIcon,
    EyeOpenIcon,
    ListBulletIcon,
    MagnifyingGlassIcon,
    MixerHorizontalIcon,
    Pencil1Icon,
    PlayIcon,
    PlusIcon,
    TextAlignCenterIcon,
    TrashIcon,
} from "@radix-ui/react-icons";
import { Button } from "../../components/ui/button";
import {
    SongBanner,
    SongDetail,
    SongHeader,
} from "../../components/ui/song-header";

import { useQueueStore } from "../../lib/store/queue-store";
import { useSongStore } from "../../lib/store/song-store";
import { ScrollArea } from "../../components/ui/scroll-area";
import { useNavigate, useParams } from "react-router-dom";
import CreateSongForm from "./create-song-form";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Song } from "@/lib/types";
import { MenuIcon } from "lucide-react";
import StatsPage from "./stats-page";
import { useUiStateStore } from "@/lib/store/ui-state-store";
import useScreenSize from "@/lib/hooks/use-screen-size";

type Order = "asc" | "desc";
type ListStyle = "compact" | "list";
type SortBy =
    | "title"
    | "source"
    | "completions"
    | "length"
    | "created"
    | "modified";

const sortSongs = (songs: Song[], order: Order, sort: SortBy) => {
    switch (sort) {
        case "title":
            return songs.sort((a, b) => {
                if (order === "asc") {
                    return a.title.localeCompare(b.title);
                } else {
                    return b.title.localeCompare(a.title);
                }
            });
        case "source":
            return songs.sort((a, b) => {
                if (order === "asc") {
                    return a.source.localeCompare(b.title);
                } else {
                    return b.source.localeCompare(a.title);
                }
            });
        case "completions":
            return songs.sort((a, b) => {
                if (order === "asc") {
                    return a.completion - b.completion;
                } else {
                    return b.completion - a.completion;
                }
            });
        case "length":
            return songs.sort((a, b) => {
                if (order === "asc") {
                    return a.content.length - b.content.length;
                } else {
                    return b.content.length - a.content.length;
                }
            });
        case "created":
            return songs.sort((a, b) => {
                if (order === "asc") {
                    return a.createdAt - b.createdAt;
                } else {
                    return b.createdAt - a.createdAt;
                }
            });
        case "modified":
            return songs.sort((a, b) => {
                if (order === "asc") {
                    return a.lastModifiedAt - b.lastModifiedAt;
                } else {
                    return b.lastModifiedAt - a.lastModifiedAt;
                }
            });

        default:
            return songs;
    }
};

const SongItemPopover = ({ song }: { song: Song }) => {
    const queueNext = useQueueStore.use.queueNext();
    const removeSong = useSongStore.use.removeSong();
    const enqueue = useQueueStore.use.enqueue();

    const onAddToQueue = (songId: string) => {
        enqueue(songId);
    };
    const navigate = useNavigate();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="p-2">
                <DotsHorizontalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem
                    className="space-x-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        console.error("Play button not implemented yet.");
                    }}
                >
                    <PlayIcon />
                    <span> Play</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="space-x-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        onAddToQueue(song.id);
                    }}
                >
                    <PlusIcon />
                    <span> Queue</span>
                </DropdownMenuItem>
                {/* <DropdownMenuItem className="space-x-1">
        <PlusIcon />
        <span> Playlist</span>
    </DropdownMenuItem> */}
                <DropdownMenuItem
                    className="space-x-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        queueNext(song.id);
                    }}
                >
                    <PlusIcon />
                    <span> Next</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="space-x-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`./${song.id}`);
                    }}
                >
                    <EyeOpenIcon />
                    <span>View more</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="space-x-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`./${song.id}/edit`);
                    }}
                >
                    <Pencil1Icon />
                    <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="space-x-1 text-destructive">
                    <AlertDialog>
                        <AlertDialogTrigger
                            asChild
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            <div className="gap-1 relative flex  cursor-default select-none items-center rounded-sm   text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground ">
                                <TrashIcon />
                                Delete
                            </div>
                        </AlertDialogTrigger>
                        <AlertDialogContent
                            onClick={(e) => e.stopPropagation()}
                        >
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete the song.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeSong(song.id);
                                        navigate("/songs");
                                    }}
                                >
                                    Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const SongLyricHoverCard = ({ song }: { song: Song }) => {
    return (
        <HoverCard openDelay={500} closeDelay={0}>
            <HoverCardTrigger
                className="hidden md:block p-2"
                onClick={(e) => e.stopPropagation()}
            >
                <TextAlignCenterIcon />
            </HoverCardTrigger>
            <HoverCardContent
                className="w-fit text-xs max-h-[20rem] overflow-hidden"
                side="bottom"
                align={"end"}
            >
                <span className="text-muted-foreground font-bold">Lyrics</span>
                <pre>
                    {song.content.slice(0, 256)}
                    {song.content.length > 256 && "..."}
                </pre>
            </HoverCardContent>
        </HoverCard>
    );
};

const SongStats = ({ song }: { song: Song }) => {
    return (
        <div
            className=" gap-4 border border-dashed  p-2 rounded-lg hidden sm:flex"
            onClick={(e) => e.stopPropagation()}
        >
            <span className="text-xs text-muted-foreground border-r pr-3">
                {song.content.length} ch
            </span>
            <span className="text-xs text-muted-foreground">
                {song.record.accuracy}%
            </span>
            <span className="text-xs text-muted-foreground">
                {song.record.wpm} wpm
            </span>
            <span className="text-xs text-muted-foreground">
                {song.completion} completions
            </span>
        </div>
    );
};

const SongItem = ({
    song,
    index,
    listStyle,
}: {
    song: Song;
    index: number;
    listStyle: ListStyle;
}) => {
    const removeSong = useSongStore.use.removeSong();

    const currentSong = useQueueStore.use.current();
    const enqueue = useQueueStore.use.enqueue();
    const queueNext = useQueueStore.use.queueNext();

    const navigate = useNavigate();

    const onAddToQueue = (songId: string) => {
        enqueue(songId);
    };

    if (listStyle == "compact") {
        return (
            <div
                className="border py-1 px-4 group hover:bg-secondary rounded-md flex justify-between items-center "
                onClick={() => navigate(`/songs/${song.id}`)}
            >
                <div className="flex gap-4 items-center">
                    <div
                        className="text-muted group-hover:text-foreground text-xs sm:text-md"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {index + 1}
                    </div>
                    <div
                        className=" gap-3 flex justify-between text-xs sm:text-sm items-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span className="font-semibold  text-ellipsis overflow-hidden whitespace-nowrap">
                            {song.title}
                        </span>
                        <span className="text-muted-foreground hidden sm:block">
                            -
                        </span>
                        <span className="text-muted-foreground">
                            {song.source}
                        </span>
                    </div>
                </div>

                <div className="flex gap-1 items-center">
                    <SongLyricHoverCard song={song} />
                    <SongStats song={song} />
                    <SongItemPopover song={song} />
                </div>
            </div>
        );
    }

    return (
        <div
            className="border p-4  group hover:bg-secondary rounded-md flex justify-between items-center "
            key={song.id}
            onClick={() => navigate(`/songs/${song.id}`)}
        >
            <div className="flex gap-4 items-center ">
                <div
                    className="text-muted group-hover:text-foreground "
                    onClick={(e) => e.stopPropagation()}
                >
                    {index + 1}
                </div>
                <SongHeader>
                    <SongBanner
                        song={song}
                        onClick={(e) => e.stopPropagation()}
                        playButton
                    />
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
                <div className="flex items-center md:w-[22rem] justify-between">
                    <SongLyricHoverCard song={song} />
                    <SongStats song={song} />
                </div>
                <div className="gap-1 hidden lg:flex">
                    <Button
                        className="gap-1"
                        size={"sm"}
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddToQueue(song.id);
                        }}
                        variant={"outline"}
                    >
                        <PlusIcon />
                        <span> Queue</span>
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger
                            asChild
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            <Button variant={"destructive"}>
                                <TrashIcon />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent
                            onClick={(e) => e.stopPropagation()}
                        >
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete the song.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeSong(song.id);
                                        navigate("/songs");
                                    }}
                                >
                                    Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <SongItemPopover song={song} />
            </div>
        </div>
    );
};

const AllSongs = () => {
    // TODO : Include song content in the search
    // TODO : Highlight the section that was searched for and found, this includes some element to show it was found in lyrics
    const [sortOrder, setSortOrder] = useState<Order>("asc");
    const [sortBy, setSortBy] = useState<SortBy>("created");
    const [listStyle, setListStyle] = useState<ListStyle>("list");
    const [searchTerm, setSearchTerm] = useState("");
    const songsList = useSongStore.use.songs();
    const sortedSongs = useMemo(() => {
        return sortSongs(songsList, sortOrder, sortBy);
    }, [songsList, sortOrder, sortBy]);

    const lowerCaseSearchTerm = searchTerm.toLocaleLowerCase();

    const listStyleOptions = ["list", "compact"];
    const sortOrderOptions = ["asc", "desc"];
    const sortByOptions = [
        "title",
        "source",
        "length",
        "completions",
        "created",
        "modified",
    ];

    const onChangeSortOrder = (val: string) => {
        if (val != "asc" && val != "desc") return;

        setSortOrder(val);
    };

    const onChangeSortBy = (val: string) => {
        if (
            val != "title" &&
            val != "source" &&
            val != "length" &&
            val != "modified" &&
            val != "created" &&
            val != "completions"
        )
            return;

        setSortBy(val);
    };

    const onChangeListStyle = (val: string) => {
        if (val != "list" && val != "compact") return;

        setListStyle(val);
    };

    const isSortNotStandard = sortBy != "created" || sortOrder != "asc";

    return (
        <>
            <div className="absolute right-3  -top-12  items-center gap-6 hidden lg:flex ">
                <div>
                    <Popover>
                        <PopoverTrigger>
                            <ListBulletIcon
                                className={
                                    listStyle == "compact" ? "text-primary" : ""
                                }
                            />
                        </PopoverTrigger>
                        <PopoverContent className="space-y-2 w-fit">
                            <ToggleGroup
                                value={listStyle}
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
                                        <span className="mr-auto">
                                            {option}
                                        </span>
                                    </ToggleGroupItem>
                                ))}
                            </ToggleGroup>
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="flex items-center gap-8 border-l pl-6">
                    <div>
                        <Popover>
                            <PopoverTrigger>
                                <MixerHorizontalIcon
                                    className={
                                        isSortNotStandard ? "text-primary" : ""
                                    }
                                />
                            </PopoverTrigger>
                            <PopoverContent className="space-y-2 w-fit">
                                <ToggleGroup
                                    value={sortBy}
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
                                            <span className="mr-auto">
                                                {option}
                                            </span>
                                        </ToggleGroupItem>
                                    ))}
                                </ToggleGroup>

                                <ToggleGroup
                                    value={sortOrder}
                                    onValueChange={(val) =>
                                        onChangeSortOrder(val)
                                    }
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
                                            <span className="mr-auto">
                                                {option}
                                            </span>
                                        </ToggleGroupItem>
                                    ))}
                                </ToggleGroup>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="flex items-center gap-1 ">
                        <MagnifyingGlassIcon
                            className={
                                searchTerm.length > 0 ? "text-primary" : ""
                            }
                        />

                        <div className="relative">
                            <Input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
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

            <div className="absolute right-3 -top-9 flex gap-8 lg:hidden ">
                <Popover>
                    <PopoverTrigger>
                        <ListBulletIcon
                            className={
                                listStyle == "compact" ? "text-primary" : ""
                            }
                        />
                    </PopoverTrigger>
                    <PopoverContent className="space-y-2 w-fit">
                        <ToggleGroup
                            value={listStyle}
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
                    <DrawerTrigger>
                        <MixerHorizontalIcon
                            className={
                                searchTerm.length > 0 || isSortNotStandard
                                    ? "text-primary"
                                    : ""
                            }
                        />
                    </DrawerTrigger>
                    <DrawerContent className="h-[70vh] px-10">
                        <DrawerHeader>
                            <DrawerTitle className="sr-only">
                                Search for songs or change how songs are sorted.
                            </DrawerTitle>
                            <DrawerDescription className="sr-only">
                                Sort of search.
                            </DrawerDescription>
                        </DrawerHeader>
                        <div className="flex flex-col justify-between h-full px-2 pt-2 pb-6">
                            <div>
                                <h2 className="text-center text-lg font-semibold pb-2">
                                    Search
                                </h2>
                                <div className="flex items-center gap-1 ">
                                    <MagnifyingGlassIcon
                                        className={
                                            searchTerm.length > 0
                                                ? "text-primary"
                                                : ""
                                        }
                                    />

                                    <div className="relative w-full">
                                        <Input
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                        />
                                        {searchTerm.length != 0 && (
                                            <Button
                                                size={"icon"}
                                                variant={"ghost"}
                                                onClick={() =>
                                                    setSearchTerm("")
                                                }
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
                                    <h2 className="text-center text-lg font-semibold pb-2">
                                        Sort
                                    </h2>
                                    <ToggleGroup
                                        value={sortBy}
                                        onValueChange={(val) =>
                                            onChangeSortBy(val)
                                        }
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
                                                <span className="mr-auto">
                                                    {option}
                                                </span>
                                            </ToggleGroupItem>
                                        ))}
                                    </ToggleGroup>

                                    <ToggleGroup
                                        value={sortOrder}
                                        onValueChange={(val) =>
                                            onChangeSortOrder(val)
                                        }
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
                                                <span className="mr-auto">
                                                    {option}
                                                </span>
                                            </ToggleGroupItem>
                                        ))}
                                    </ToggleGroup>
                                </div>
                            </div>
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>

            <div className="relative h-full border-t">
                {/* <Button>Add all to queue</Button> */}
                <ScrollArea className="h-[calc(100%)] pr-3 pt-2 ">
                    {/* <div className="space-y-2  pr-2"> */}
                    <div className="flex flex-col gap-2 ">
                        {sortedSongs
                            .filter(
                                (song) =>
                                    song.title
                                        .toLocaleLowerCase()
                                        .includes(lowerCaseSearchTerm) ||
                                    song.source
                                        .toLocaleLowerCase()
                                        .includes(lowerCaseSearchTerm)
                            )
                            .map((song, index) => (
                                <SongItem
                                    key={song.id}
                                    song={song}
                                    index={index}
                                    listStyle={listStyle}
                                />
                            ))}
                    </div>
                    {/* </div> */}
                </ScrollArea>
            </div>
        </>
    );
};

export default function Songs() {
    return (
        <Tabs defaultValue="all-songs" className="py-12 h-full ">
            <TabsList className="mx-2 sm:mx-6 md:mx-12">
                <TabsTrigger value="all-songs">All songs</TabsTrigger>
                {/* <TabsTrigger value="playlists">Playlists</TabsTrigger> */}
                <TabsTrigger
                    value="add-song"
                    className="flex items-center gap-1"
                >
                    <PlusIcon />
                    Add song
                </TabsTrigger>
                <TabsTrigger value="stats">Stats</TabsTrigger>
            </TabsList>
            <TabsContent
                value="all-songs"
                className=" h-[100%] px-2 sm:px-6 md:px-12"
            >
                <div className="h-full w-full relative">
                    <AllSongs />
                </div>
            </TabsContent>
            {/* <TabsContent value="playlists">playlists</TabsContent> */}
            <TabsContent value="add-song" className=" h-[100%] ">
                <CreateSongForm />
            </TabsContent>
            <TabsContent
                value="stats"
                className=" h-[100%] px-2 sm:px-6 md:px-12 border-t"
            >
                <StatsPage />
            </TabsContent>
        </Tabs>
    );
}

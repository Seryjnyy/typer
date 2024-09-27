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
import KeyboardButton from "@/components/keyboard-button";
import BackButton from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SongBanner, SongHeader } from "@/components/ui/song-header";
import { Switch } from "@/components/ui/switch";
import { useSongStore } from "@/lib/store/song-store";
import { Song as SongType } from "@/lib/types";
import { cn, formatTimestamp } from "@/lib/utils";
import {
    Pencil1Icon,
    PlayIcon,
    PlusIcon,
    ReloadIcon,
} from "@radix-ui/react-icons";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";

import {
    DotsHorizontalIcon,
    EyeOpenIcon,
    TrashIcon,
} from "@radix-ui/react-icons";

import { useQueueStore } from "../../lib/store/queue-store";
import SongPopover from "./song-popover";

interface SongContentProps {
    song: SongType;
    verseMode: boolean;
}

type Verse = { id: number; data: string };

const SomethingWentWrong = () => {
    return (
        <div className="flex justify-center items-center h-full flex-col gap-12">
            <div className="text-center">
                <h1 className="text-xl font-semibold">
                    Sorry something went wrong.
                </h1>
                <p>The song might not exist anymore.</p>
            </div>
            <BackButton link="/songs" />
        </div>
    );
};

const SongContent = ({ song, verseMode }: SongContentProps) => {
    const [selected, setSelected] = useState<Verse[]>([]);
    const navigate = useNavigate();

    const verses = song.content
        .split(/\n\s*\n/)
        .map((verse, i) => ({ id: i, data: verse }));

    const onSelectVerse = (verse: Verse) => {
        if (!verseMode) return;

        if (selected.find((x) => x.id == verse.id) != null) {
            // Remove
            setSelected((prev) => prev.filter((x) => x.id != verse.id));
        } else {
            // Add
            setSelected((prev) => [...prev, verse]);
        }
    };

    const onResetSelected = () => {
        setSelected([]);
    };

    const onTrySelected = () => {
        if (!verseMode) return;

        navigate("/verse", {
            state: {
                content: selected
                    .map((x) => x.data)
                    .reduce((prev, curr) => prev + "\n\n" + curr),
                id: song.id,
                cameFrom: `/songs/${song.id}`,
            },
        });
    };

    return (
        <pre className="font-sans sm:px-4 max-w-[calc(100vw-1rem)] text-wrap">
            {verseMode && (
                <div className="py-2 px-2 text-muted-foreground flex items-center justify-between  border-b mb-4">
                    <div className="flex items-center gap-2 text-sm">
                        <span>{selected.length} selected</span>
                        <Button
                            size={"icon"}
                            variant={"ghost"}
                            onClick={onResetSelected}
                        >
                            <ReloadIcon className="size-3" />
                        </Button>
                    </div>
                    <KeyboardButton
                        onClick={onTrySelected}
                        disabled={selected.length == 0}
                    />
                </div>
            )}
            {verses.map((verse) => (
                <div key={verse.id}>
                    <div
                        className={cn(
                            " w-fit p-1 rounded-md ",
                            {
                                "hover:outline outline-primary cursor-pointer":
                                    verseMode,
                            },
                            {
                                "outline outline-primary":
                                    verseMode &&
                                    selected.find((x) => x.id == verse.id) !=
                                        null,
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
    );
};

// TODO : on smaller screens text will be too long fix that
export default function Song() {
    const [verseMode, setVerseMode] = useState(false);
    const songs = useSongStore.use.songs();
    const { songID } = useParams();

    if (!songID) {
        throw Error("No song ID provided.");
    }

    const song = songs.find((x) => x.id == songID);

    // TODO : Could be better
    if (!song) return <SomethingWentWrong />;

    return (
        <div className={` h-[100%]  `}>
            <ScrollArea
                className={`h-[100%] px-2 sm:px-12 pb-2  flex flex-col relative bg-gradient-to-b  ${
                    song.cover.split(" ")[1]
                } sm:rounded-md from-[5%] to-[30%]`}
            >
                <div className="flex flex-col items-start justify-start space-y-12 pt-12 w-full ">
                    <BackButton link="/songs" />
                    <div className="space-y-4 w-full">
                        <div>
                            <SongHeader>
                                <SongBanner song={song} size={"extraLarge"} />
                                <div className="flex flex-col justify-center items-start px-8">
                                    <h1 className="text-2xl font-bold">
                                        {song.title}
                                    </h1>
                                    <p className="text-muted-foreground">
                                        {song.source}
                                    </p>
                                </div>
                            </SongHeader>
                        </div>

                        <div className="flex items-end justify-between   w-full ">
                            <div className="flex gap-4 border border-dashed p-2 rounded-lg w-fit ">
                                <span className="text-xs text-muted-foreground">
                                    {song.record.accuracy}%
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {song.record.wpm} chpm
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {song.completion} completions
                                </span>
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
                                    <Label
                                        htmlFor="verse-mode "
                                        className="text-xs text-muted-foreground"
                                    >
                                        verse mode
                                    </Label>
                                    <Switch
                                        id="verse-mode"
                                        checked={verseMode}
                                        onCheckedChange={(val) =>
                                            setVerseMode(val)
                                        }
                                    />
                                </div>
                                {/* <div className="w-fit">
                                    <Link to={"edit"}>
                                        <Button size={"icon"} variant={"ghost"}>
                                            <Pencil1Icon />
                                        </Button>
                                    </Link>
                                </div> */}

                                <SongPopover
                                    song={song}
                                    exclude={{ viewMore: true }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-12 text-sm sm:text-md md:text-lg">
                    <SongContent song={song} verseMode={verseMode} />
                </div>

                <div className="w-full px-2 flex items-center pt-24 flex-wrap gap-2 sm:gap-12">
                    <div className="flex  text-muted-foreground gap-1">
                        <span className="text-xs opacity-70">created at: </span>
                        <span className="text-xs">
                            {formatTimestamp(song.createdAt)}
                        </span>
                    </div>
                    <div className="flex  text-muted-foreground gap-1">
                        <span className="text-xs opacity-70">
                            last modified at:
                        </span>
                        <span className="text-xs">
                            {formatTimestamp(song.lastModifiedAt)}
                        </span>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}

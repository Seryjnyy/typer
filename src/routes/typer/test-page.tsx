import { Button } from "@/components/ui/button";
import { useQueueStore } from "@/lib/store/queue-store";
import { useSongProgressStore } from "@/lib/store/song-progress-store";
import { useSongStore } from "@/lib/store/song-store";
import { useUiStateStore } from "@/lib/store/ui-state-store";
import { Song } from "@/lib/types";
import {
    calculateAccuracy,
    chpm,
    cn,
    textModification,
    TextModificationOptions,
} from "@/lib/utils";
import { Handlers, ProgressManager, SongData } from "@/routes/typer/typing";
import { ArrowRightIcon, GearIcon, ReloadIcon } from "@radix-ui/react-icons";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStopwatch } from "react-timer-hook";
import EndScreen from "./end-screen";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import Test from "./test";

import { Progress } from "@/components/ui/progress";
import Stat from "./stat";
import NoSongSelected from "./no-song-selected";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTextModificationsStore } from "@/lib/store/text-modifications-store";
import { Toggle } from "@/components/ui/toggle";
import Ch, { chVariant } from "@/components/ch";

const Stats = ({
    onRestart,
    children,
    className,
}: {
    onRestart: () => void;
    className?: string;
    children?: ReactNode;
}) => {
    const correct = useSongProgressStore.use.correct();
    const incorrect = useSongProgressStore.use.incorrect();
    const userInput = useSongProgressStore.use.userInput();
    const completed = useSongProgressStore.use.completed();
    const timeElapsed = useSongProgressStore.use.timeElapsed();
    const totalChar = useSongProgressStore.use.songTotalChar();

    return (
        <div
            className={cn(
                "  border-r flex flex-col  w-[15rem] pt-[8.3rem]",
                className
            )}
        >
            <div className="mx-2 space-y-4">
                <div className="border rounded-md  p-2">
                    <Stat title="time" stat={timeElapsed} append="s" />
                    <Stat
                        title="chpm"
                        stat={
                            timeElapsed == 0
                                ? userInput.length
                                : chpm(userInput.length, timeElapsed)
                        }
                    />
                    <Stat
                        title="accuracy"
                        stat={calculateAccuracy(correct, userInput.length)}
                        append="%"
                    />
                    <Stat
                        title="ch"
                        stat={`${userInput.length}/${totalChar}`}
                    />
                </div>
                <Button
                    className="w-full"
                    variant={"outline"}
                    onClick={onRestart}
                >
                    <ReloadIcon />
                </Button>
                <div className="space-y-1">
                    <Progress value={(userInput.length / totalChar) * 100} />
                    {completed && (
                        <div className="text-primary flex justify-center text-xs uppercase opacity-80">
                            <span>complete</span>
                        </div>
                    )}
                </div>

                <div className="border rounded-md  p-2">
                    <Stat title="correct" stat={correct} />
                    <Stat title="incorrect" stat={incorrect} />
                    {/* <Stat title="focused" stat={focusedOnInput} /> */}
                </div>
            </div>

            <div className="flex flex-col gap-2 pt-4">{children}</div>
        </div>
    );
};

const CurrentView = () => {
    const harderOptions = useTextModificationsStore.use.harderOptions();
    const txtMod = useTextModificationsStore.use.textModifications();

    let before = textModification("Som", txtMod);
    let current = textModification("e", txtMod);
    let after = textModification("good song lyrics yeah!1", txtMod);
    let currentChVariant: chVariant = "current";
    let afterChVariant: chVariant = "normal";

    console.log(harderOptions);

    if (harderOptions.cantSeeAhead) {
        after = after.replace(/[^ ]/g, "_");

        if (!harderOptions.cantSeeUnderlines) {
            afterChVariant = "normal";
        } else {
            afterChVariant = "normalInvisible";
        }
    }

    if (harderOptions.cantSeeCurrent) {
        current = current.replace(/[^ ]/g, "_");

        if (!harderOptions.cantSeeUnderlines) {
            currentChVariant = "current";
        } else {
            currentChVariant = "currentInvisible";
        }
    }

    return (
        <div className="w-full border rounded-md p-2 flex items-center flex-col">
            <span className="text-sm font-bold pb-1 text-muted-foreground">
                Your current view
            </span>
            <div className="border rounded p-2 w-full">
                <Ch variant={"correct"}>{before}</Ch>
                <Ch variant={currentChVariant}>{current}</Ch>{" "}
                <Ch variant={afterChVariant}>{after}</Ch>
            </div>
        </div>
    );
};
const TextModificationDialog = () => {
    const txtMod = useTextModificationsStore.use.textModifications();
    const setTxtMod = useTextModificationsStore.use.setTextModifications();

    const onChangeLetterCase = (val: string) => {
        if (val != "normal" && val != "upper" && val != "lower") return;

        setTxtMod({ ...txtMod, letterCase: val });
    };
    const onChangePunctuation = (val: string) => {
        if (val != "normal" && val != "removed") return;
        setTxtMod({ ...txtMod, punctuation: val });
    };

    const onChangeNumbers = (val: string) => {
        if (val != "normal" && val != "removed") return;
        setTxtMod({ ...txtMod, numbers: val });
    };

    const isTxtModificationChanged =
        txtMod.letterCase != "normal" ||
        txtMod.punctuation != "normal" ||
        txtMod.numbers != "normal";

    const harderOptions = useTextModificationsStore.use.harderOptions();
    const setHarderOptions = useTextModificationsStore.use.setHarderOptions();
    const resetHarderOptions =
        useTextModificationsStore.use.resetHarderOptions();
    const resetTextModifications =
        useTextModificationsStore.use.resetTextModifications();

    const onChangeCantSeeAhead = (val: boolean) => {
        setHarderOptions({
            ...harderOptions,
            cantSeeAhead: val,
            cantSeeCurrent: !val ? false : harderOptions.cantSeeCurrent,
            cantSeeUnderlines: !val ? false : harderOptions.cantSeeUnderlines,
        });
    };

    const onChangeCantSeeCurrent = (val: boolean) => {
        setHarderOptions({ ...harderOptions, cantSeeCurrent: val });
    };

    const onChangeCantSeeUnderlines = (val: boolean) => {
        setHarderOptions({ ...harderOptions, cantSeeUnderlines: val });
    };

    const onResetAll = () => {
        resetHarderOptions();
        resetTextModifications;
    };

    const isHarderOptionsChanged =
        harderOptions.cantSeeAhead ||
        harderOptions.cantSeeCurrent ||
        harderOptions.cantSeeUnderlines;
    return (
        <Dialog>
            <DialogTrigger className="group p-2">
                <div className="relative ">
                    <GearIcon className="group-hover:text-primary" />
                    {isTxtModificationChanged && (
                        <span className="text-emerald-400 absolute bottom-0 left-2 font-bold">
                            *
                        </span>
                    )}

                    {isHarderOptionsChanged && (
                        <span className="text-red-600 absolute bottom-0 right-2 font-bold">
                            *
                        </span>
                    )}
                </div>
            </DialogTrigger>
            <DialogContent className="h-[72vh] flex flex-col">
                <DialogHeader className="relative">
                    <Button
                        className="absolute -top-[1.17rem] right-4"
                        size={"icon"}
                        variant={"ghost"}
                        onClick={onResetAll}
                    >
                        <ReloadIcon className="w-3 h-3" />
                    </Button>
                    <DialogTitle className="sr-only">
                        Text modification
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        Make it easier by changing the text or make it harder by
                        changing how things are displayed.
                    </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="easier" className="pt-4">
                    <TabsList className="w-full mb-3">
                        <TabsTrigger value="easier" className="w-full">
                            Easier
                        </TabsTrigger>
                        <TabsTrigger value="harder" className="w-full">
                            Harder
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="easier" className="">
                        <div className="p-2 space-y-2">
                            <div className="border rounded-sm p-2 space-y-2">
                                <span className="text-xl font-bold">
                                    Letter case
                                    {txtMod.letterCase != "normal" ? (
                                        <span className="text-primary">*</span>
                                    ) : (
                                        ""
                                    )}{" "}
                                    <span className="text-xs text-muted-foreground">
                                        {"(a-z A-Z)"}
                                    </span>
                                </span>
                                <ToggleGroup
                                    className="flex justify-start items-center "
                                    type="single"
                                    value={txtMod.letterCase}
                                    onValueChange={(val) =>
                                        onChangeLetterCase(val)
                                    }
                                >
                                    <ToggleGroupItem
                                        value="normal"
                                        aria-label="Toggle bold"
                                    >
                                        Normal
                                    </ToggleGroupItem>
                                    <ToggleGroupItem
                                        value="upper"
                                        aria-label="Toggle italic"
                                    >
                                        UPPER
                                    </ToggleGroupItem>
                                    <ToggleGroupItem
                                        value="lower"
                                        aria-label="Toggle underline"
                                    >
                                        lower
                                    </ToggleGroupItem>
                                </ToggleGroup>
                            </div>
                            <div className="border rounded-sm p-2 space-y-2">
                                <span className="text-xl font-bold">
                                    Punctuation
                                    {txtMod.punctuation != "normal" ? (
                                        <span className="text-primary">*</span>
                                    ) : (
                                        ""
                                    )}{" "}
                                    <span className="text-xs text-muted-foreground">
                                        {"(,./?(){}#@)"}
                                    </span>
                                </span>
                                <ToggleGroup
                                    className="flex justify-start items-center "
                                    type="single"
                                    value={txtMod.punctuation}
                                    onValueChange={(val) =>
                                        onChangePunctuation(val)
                                    }
                                >
                                    <ToggleGroupItem
                                        value="normal"
                                        aria-label="Toggle bold"
                                    >
                                        Normal
                                    </ToggleGroupItem>
                                    <ToggleGroupItem
                                        value="removed"
                                        aria-label="Toggle italic"
                                    >
                                        Removed
                                    </ToggleGroupItem>
                                </ToggleGroup>
                            </div>
                            <div className="border rounded-sm p-2 space-y-2">
                                <span className="text-xl font-bold">
                                    Numbers
                                    {txtMod.numbers != "normal" ? (
                                        <span className="text-primary">*</span>
                                    ) : (
                                        ""
                                    )}{" "}
                                    <span className="text-xs text-muted-foreground">
                                        (0-9)
                                    </span>
                                </span>
                                <ToggleGroup
                                    className="flex justify-start items-center "
                                    type="single"
                                    value={txtMod.numbers}
                                    onValueChange={(val) =>
                                        onChangeNumbers(val)
                                    }
                                >
                                    <ToggleGroupItem
                                        value="normal"
                                        aria-label="Toggle bold"
                                    >
                                        Normal
                                    </ToggleGroupItem>
                                    <ToggleGroupItem
                                        value="removed"
                                        aria-label="Toggle italic"
                                    >
                                        Removed
                                    </ToggleGroupItem>
                                </ToggleGroup>
                            </div>
                            {isTxtModificationChanged && (
                                <p className="text-orange-500 text-xs pt-4">
                                    Warning: These settings can make the
                                    gameplay easier so as a result any high
                                    score you get will not be saved.
                                </p>
                            )}
                        </div>
                    </TabsContent>
                    <TabsContent value="harder">
                        <div className="p-2 space-y-8">
                            <CurrentView />
                            <div>
                                {" "}
                                <div className="border rounded-sm p-2 space-y-2">
                                    <span className="text-xl font-bold">
                                        Modifiers
                                        {harderOptions.cantSeeAhead ||
                                        harderOptions.cantSeeCurrent ? (
                                            <span className="text-primary">
                                                *
                                            </span>
                                        ) : (
                                            ""
                                        )}{" "}
                                        <span className="text-xs text-muted-foreground">
                                            {"(Pick and choose.)"}
                                        </span>
                                    </span>
                                    <div className="flex  items-center gap-1 ml-2">
                                        <div>
                                            <div className="flex flex-col justify-center items-center rounded-sm border p-2 w-fit space-y-1">
                                                <div className="border rounded p-2 w-full">
                                                    <Ch variant={"correct"}>
                                                        Som
                                                    </Ch>
                                                    <Ch variant={"current"}>
                                                        e
                                                    </Ch>{" "}
                                                    ____ __
                                                </div>
                                                <Toggle
                                                    pressed={
                                                        harderOptions.cantSeeAhead
                                                    }
                                                    onPressedChange={(val) =>
                                                        onChangeCantSeeAhead(
                                                            val
                                                        )
                                                    }
                                                >
                                                    Can't see ahead
                                                </Toggle>
                                            </div>
                                        </div>
                                        <div className="h-full">
                                            <ArrowRightIcon />
                                        </div>

                                        <div className="space-y-2 w-fit">
                                            <div>
                                                <div className="flex flex-col justify-center items-center rounded-sm border p-2 space-y-1 w-full">
                                                    <div className="border rounded p-2 w-full">
                                                        <Ch variant={"correct"}>
                                                            Som
                                                        </Ch>
                                                        <Ch
                                                            variant={
                                                                "currentInvisible"
                                                            }
                                                        >
                                                            e
                                                        </Ch>{" "}
                                                        ____ __
                                                    </div>
                                                    <Toggle
                                                        pressed={
                                                            harderOptions.cantSeeCurrent
                                                        }
                                                        onPressedChange={(
                                                            val
                                                        ) =>
                                                            onChangeCantSeeCurrent(
                                                                val
                                                            )
                                                        }
                                                        disabled={
                                                            !harderOptions.cantSeeAhead
                                                        }
                                                    >
                                                        Can't see current
                                                    </Toggle>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex flex-col justify-center items-center rounded-sm border p-2 w-full space-y-1">
                                                    <div className="border rounded p-2 w-full">
                                                        <Ch variant={"correct"}>
                                                            Som
                                                        </Ch>
                                                        <Ch variant={"current"}>
                                                            e
                                                        </Ch>{" "}
                                                    </div>
                                                    <Toggle
                                                        pressed={
                                                            harderOptions.cantSeeUnderlines
                                                        }
                                                        onPressedChange={(
                                                            val
                                                        ) =>
                                                            onChangeCantSeeUnderlines(
                                                                val
                                                            )
                                                        }
                                                        disabled={
                                                            !harderOptions.cantSeeAhead
                                                        }
                                                    >
                                                        Can't see underlines
                                                    </Toggle>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <Button
                                        className=" space-x-2 text-muted-foreground "
                                        size={"sm"}
                                        variant={"ghost"}
                                        onClick={resetHarderOptions}
                                    >
                                        <ReloadIcon className="w-3 h-3" />
                                        <span>reset harder options</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};

export default function TestPage() {
    const currentSongInQueue = useQueueStore.use.current();
    const songList = useSongStore.use.songs();

    const completed = useSongProgressStore.use.completed();
    const setCompleted = useSongProgressStore.use.setCompleted();

    const setCorrect = useSongProgressStore.use.setCorrect();
    const correct = useSongProgressStore.use.correct();
    const setIncorrect = useSongProgressStore.use.setIncorrect();

    const userInput = useSongProgressStore.use.userInput();
    const setUserInput = useSongProgressStore.use.setUserInput();

    const setTargetChar = useSongProgressStore.use.setSongTotalChar();
    const setTypedCharCount = useSongProgressStore.use.setSongTypedChar();
    const resetProgressState = useSongProgressStore.use.resetState();

    const timeElapsed = useSongProgressStore.use.timeElapsed();
    const setTimeElapsed = useSongProgressStore.use.setTimeElapsed();

    const autoplay = useQueueStore.use.autoplay();
    const next = useQueueStore.use.next();

    const queueWindowOpen = useUiStateStore.use.queueWindowOpen();

    const editSongCompletion = useSongStore.use.editSongCompletion();
    const editSongRecord = useSongStore.use.editSongRecord();

    const txtMods = useTextModificationsStore.use.textModifications();
    const difficultyModifiers = useTextModificationsStore.use.harderOptions();

    const {
        totalSeconds,
        start: startStopwatch,
        pause: pauseStopwatch,
        reset: resetStopwatch,
    } = useStopwatch({
        autoStart: false,
    });

    const songData: {
        song: Song;
        songContent: { full: string; stripped: string };
    } | null = useMemo(() => {
        const s = songList.find((x) => x.id == currentSongInQueue);
        if (!s) return null;

        let txt = textModification(s.content, txtMods);

        return {
            song: s,
            songContent: {
                full: txt,
                stripped: txt.replace(/(\r\n|\n|\r)/gm, ""),
            },
        };
    }, [songList, currentSongInQueue, txtMods]);

    const progressManager: ProgressManager = {
        userInput: userInput,
        completed: completed,
        setCompleted: setCompleted,
        setCorrect: setCorrect,
        setIncorrect: setIncorrect,
        setUserInput: setUserInput,
        setTargetCharCount: setTargetChar,
        setTypedCharCount: setTypedCharCount,
        restartState: resetProgressState,
    };

    const navigate = useNavigate();

    const handlers: Handlers = {
        onStart: () => {
            startStopwatch();
        },
        onChangeSong: () => {
            resetProgressState();
            resetStopwatch(undefined, false);
        },
        onFinish: () => {
            pauseStopwatch();
            if (autoplay) {
                next();
            }

            if (!songData) return;

            editSongCompletion(songData.song.id, songData.song.completion + 1);

            const resultChpm =
                timeElapsed == 0
                    ? userInput.length
                    : chpm(userInput.length, timeElapsed);

            const resultAcc = calculateAccuracy(correct, userInput.length);
            if (
                resultChpm > songData.song.record.chpm ||
                (resultChpm == songData.song.record.chpm &&
                    resultAcc > songData.song.record.accuracy)
            ) {
                // TODO : Set song record
                editSongRecord(songData.song.id, {
                    chpm: resultChpm,
                    accuracy: resultAcc,
                });
            }
        },
        onClickVerse: (verse: string) => {
            navigate("/verse", {
                state: { content: verse, id: songData?.song.id ?? "" },
            });
        },
    };

    const onRestart = () => {
        resetProgressState();
        resetStopwatch(undefined, false);
    };

    useEffect(() => {
        setTimeElapsed(totalSeconds);
    }, [totalSeconds]);

    // console.log(completed ? "song-completed" : "not-completed");
    return (
        <div
            className={cn(
                "h-[calc(100vh-4rem)] w-full flex overflow-hidden "
                // queueWindowOpen ? "" : "pr-[15rem]"
            )}
        >
            {songData == null && <NoSongSelected />}
            {songData != null && (
                <Test
                    songData={songData}
                    progressManager={progressManager}
                    handlers={handlers}
                    tryVerseOption={true}
                    difficultyModifiers={difficultyModifiers}
                >
                    {/* <Stats onRestart={onRestart} className="absolute left-0" /> */}
                    <div className="absolute left-8 bottom-[6rem] z-50">
                        <TextModificationDialog />
                    </div>
                    {!autoplay && completed && (
                        <EndScreen
                            onRestart={onRestart}
                            userInputLength={userInput.length}
                        />
                    )}
                </Test>
            )}
        </div>
    );
}

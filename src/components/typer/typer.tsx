import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useReducer, useRef, useState } from "react"
import { cn, textModification, wpm as calcWpm } from "@/lib/utils.ts"
import { TextModificationOptions, useTextModificationsStore } from "@/lib/store/text-modifications-store.tsx"
import { Textarea } from "@/components/ui/textarea.tsx"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx"
import TextModificationDialog from "@/components/typer/text-modification-dialog.tsx"
import { useStopwatch } from "react-timer-hook"
import { Song } from "@/lib/types.ts"
import { Button } from "@/components/ui/button.tsx"
import { useHotkeys } from "react-hotkeys-hook"
import { isTryingToType } from "@/components/typer/utils.ts"
import CorrectAnim from "@/components/typer/correct-anim.tsx"
import ErrorAnim from "@/components/typer/error-anim.tsx"
import { CheckIcon, DividerVerticalIcon, KeyboardIcon, ReloadIcon } from "@radix-ui/react-icons"

import { useSong } from "@/lib/hooks/use-song.tsx"
import { GameState, TypingStats } from "@/components/typer/types.ts"
import { CompletionAnim } from "@/components/typer/completion-anim.tsx"
import { TYPER_SHORTCUTS, useShortcutInfo } from "@/lib/store/shortcuts-store.ts"
import ShortcutKeys from "@/components/shortcut-keys.tsx"
import { useSongProgress } from "@/components/typer/progress-state.ts"

enum StateActionKind {
    START = "START",
    // PAUSE = "PAUSE",
    RESTART = "RESTART",
    COMPLETE = "COMPLETE",
    RECEIVED_FOCUS = "RECEIVED_FOCUS",
    LOST_FOCUS = "LOST_FOCUS",
}

interface StateAction {
    type: StateActionKind
}

// idle -> started
// started -> out-of-focus, started -> paused, started -> completed, started -> idle
// completed -> idle
// paused -> started, paused -> idle
// out-of-focus -> started, out-of-focus -> idle

function reducer(state: GameState, action: StateAction): GameState {
    const { type } = action
    switch (type) {
        case StateActionKind.LOST_FOCUS:
            if (state === "started") {
                return "out-of-focus"
            }
            return state
        case StateActionKind.RECEIVED_FOCUS:
            if (state === "out-of-focus" || state === "paused") {
                return "started"
            }
            return state
        case StateActionKind.START:
            if (state === "idle" || state === "completed") {
                return "started"
            }
            return state
        case StateActionKind.RESTART:
            return "idle"
        case StateActionKind.COMPLETE:
            if (state === "started") {
                return "completed"
            }
            return state
        default:
            return state
    }
}

type RenderDispalyFunc = (props: { verses: Verses; inputHistory: InputHistory; currentLine: number; source: Song }) => React.ReactNode

interface PassThroughToGameEngine {
    renderDisplay: RenderDispalyFunc
    renderDecorations?: (props: { source: Song }) => React.ReactNode
    renderWhenComplete?: (props: {
        gameState: GameState
        time: number
        stats: TypingStats
        difficultyModsUsed: TextModificationOptions
        source: Song
        handleRestart: () => void
    }) => React.ReactNode
    onCompletion?: (props: { stats: TypingStats & { time: number }; textMods: TextModificationOptions; source: Song }) => void
}

interface SongProviderForTyperProps extends PassThroughToGameEngine {
    content?: string
    sourceID: string
}
export const SongProviderForTyper = ({
    content,
    sourceID,
    renderDisplay,
    renderWhenComplete,
    renderDecorations,
    onCompletion,
}: SongProviderForTyperProps) => {
    const song = useSong(sourceID)
    const txtMods = useTextModificationsStore.use.textModifications()

    const contentRes = useMemo(() => {
        if (!song) return content ?? ""
        const res = content ? content : ""
        return textModification(res, txtMods)
    }, [song, content, txtMods])

    if (!song) return <div>something went wrong...</div>

    return (
        <GameEngine
            source={song}
            content={contentRes}
            renderDisplay={renderDisplay}
            onCompletion={onCompletion}
            renderWhenComplete={renderWhenComplete}
            renderDecorations={renderDecorations}
        />
    )
}

interface GameEngineProps extends PassThroughToGameEngine {
    source: Song
    content: string
}

const RestartTyperShortcut = ({ handleRestart }: { handleRestart: () => void }) => {
    const shortcut = useShortcutInfo(TYPER_SHORTCUTS.RESTART)

    useHotkeys(
        shortcut?.hotkeys.join(",") ?? "",
        () => {
            handleRestart()
        },
        {
            enabled: shortcut?.enabled ?? false,
            enableOnFormTags: true,
        }
    )

    return null
}

const GameEngine = ({ source, content, renderDisplay, renderWhenComplete, renderDecorations, onCompletion }: GameEngineProps) => {
    const [state, dispatch] = useReducer(reducer, "idle")
    const txtMods = useTextModificationsStore.use.textModifications()
    const timerRef = useRef<{ getCurrentTime: () => number }>(null)
    const inputAnimationsRef = useRef<{
        triggerCorrectAnim: () => void
        triggerErrorAnim: () => void
    }>(null)
    const completeAnimationsRef = useRef<{
        triggerCompleteAnim: () => void
    }>(null)
    const typerRef = useRef<{ getStats: () => TypingStats }>(null)

    const startGame = () => {
        dispatch({ type: StateActionKind.START })
    }

    const handleCompletion = useCallback(() => {
        dispatch({ type: StateActionKind.COMPLETE })

        onCompletion?.({
            stats: {
                ...(typerRef.current?.getStats() ?? {
                    current: 0,
                    errorMap: new Set(),
                    correct: 0,
                    total: 0,
                    incorrect: 0,
                    skipLineUsed: false,
                }),
                time: timerRef.current?.getCurrentTime() ?? 0,
            },
            textMods: txtMods,
            source: source,
        })

        completeAnimationsRef.current?.triggerCompleteAnim()
    }, [onCompletion, typerRef, source, txtMods])

    const handleRestart = () => {
        dispatch({ type: StateActionKind.RESTART })
    }

    const handleLostFocus = () => {
        dispatch({ type: StateActionKind.LOST_FOCUS })
    }

    const handleReceivedFocus = () => {
        dispatch({ type: StateActionKind.RECEIVED_FOCUS })
    }

    const getTime = () => {
        return timerRef.current?.getCurrentTime() ?? 0
    }

    const onInput = (prevInput: string, newInput: string, target: string) => {
        if (newInput.length > prevInput.length) {
            // User is typing, not deleting, check if their input is correct

            // TODO : no check for if newInput is longer than target, could be out of bounds
            // Technically it shouldn't happen but yk
            if (newInput.charAt(newInput.length - 1) === target.charAt(newInput.length - 1)) {
                inputAnimationsRef.current?.triggerCorrectAnim()
            } else {
                inputAnimationsRef.current?.triggerErrorAnim()
            }
        } else {
            // don't show animations when user is erasing input (backspace)
        }
    }

    useEffect(() => {
        handleRestart()
    }, [content])

    // Apart from handleCompletion the other functions are simple and don't change at all, so they are not included in the dep array
    // At least that's what webstorm is deciding
    // If these functions start using state/props then include them here and useCallback them
    // Otherwise reset will be called repeatedly in the typer part
    const actions = useMemo(
        () => ({
            startGame,
            handleLostFocus,
            handleReceivedFocus,
            handleCompletion,
            handleRestart,
        }),
        [handleCompletion]
    )

    return (
        <div className="relative h-full w-full   rounded-md overflow-hidden">
            <div className={"fixed top-3 left-3 text-xs text-muted-foreground"}>{state}</div>

            <div className="absolute sm:bottom-2 bottom-14 left-2 text-xs text-muted-foreground flex items-center gap-1 z-0">
                <Timer gameState={state} ref={timerRef} />
                <Stats gameState={state} getStats={typerRef.current?.getStats} getTime={getTime} />
                <Indicators gameState={state} />
            </div>
            <div className="absolute sm:bottom-1 bottom-14 right-2 z-40 flex items-center gap-2">
                <RestartButton handleRestart={handleRestart} />
                <TextModificationDialog />
            </div>
            <Typer
                source={source}
                ref={typerRef}
                content={content}
                gameState={state}
                stateActions={actions}
                onInput={onInput}
                renderDisplay={renderDisplay}
            />
            <InputAnimations ref={inputAnimationsRef} source={source} />

            {state === "completed" && <CompleteAnimations song={source} ref={completeAnimationsRef} />}
            {state === "completed" &&
                renderWhenComplete?.({
                    gameState: state,
                    stats: typerRef.current?.getStats() ?? {
                        current: 0,
                        total: 0,
                        correct: 0,
                        errorMap: new Set(),
                        incorrect: 0,
                        skipLineUsed: false,
                    },
                    difficultyModsUsed: txtMods,
                    time: timerRef.current?.getCurrentTime() ?? 0,
                    source: source,
                    handleRestart: handleRestart,
                })}
            {renderDecorations?.({ source: source })}
            <RestartTyperShortcut handleRestart={handleRestart} />
        </div>
    )
}

const Stats = ({ gameState, getStats, getTime }: { gameState: GameState; getTime?: () => number; getStats?: () => TypingStats }) => {
    const [isRunning, setIsRunning] = useState(false)
    const [wpm, setWpm] = useState(0)
    const [skippedLine, setSkippedLine] = useState(false)
    const [, setGlobalSongProgress] = useSongProgress()

    useEffect(() => {
        if (gameState === "idle") {
            setWpm(0)
            setGlobalSongProgress(0)
            setSkippedLine(false)
            setIsRunning(false)
        } else if (gameState === "started") {
            if (!isRunning) setIsRunning(true)
        } else if (gameState === "completed") {
            setIsRunning(false)
            setGlobalSongProgress(100)
        }
    }, [gameState, isRunning, setGlobalSongProgress])

    useEffect(() => {
        let intervalId: NodeJS.Timeout

        // Fetch time and stats every half/second
        // Maybe lower it to make more responsive
        if (isRunning) {
            intervalId = setInterval(() => {
                if (!getTime || !getStats) return

                const stats = getStats()

                // Update wpm
                const time = getTime()
                if (time === 0) {
                    setWpm(stats.current)
                } else {
                    setWpm(calcWpm(stats.current, time))
                }

                // Update skip line used
                setSkippedLine(stats.skipLineUsed)

                const progress = stats.total === 0 ? 0 : (stats.current / stats.total) * 100
                setGlobalSongProgress(progress)
            }, 500)
        }

        // Cleanup function to clear the interval
        return () => {
            if (intervalId) {
                clearInterval(intervalId)
            }
        }
    }, [getStats, getTime, isRunning, setGlobalSongProgress])

    return (
        <div className={"flex items-center gap-1"}>
            <div className={"border-l pl-1"}>{wpm}wpm</div>
            {skippedLine && <div className={"border-l pl-1"}>Skip line used</div>}
        </div>
    )
}

const Indicators = ({ gameState }: { gameState: GameState }) => {
    const shortcutInfo = useShortcutInfo(TYPER_SHORTCUTS.RESTART)

    return (
        <>
            <span
                className={cn("border-l pl-1", {
                    "text-primary": gameState === "started",
                })}
            >
                <KeyboardIcon />
            </span>

            <div className="pl-1 border-l">
                {(gameState === "started" || gameState === "out-of-focus") && (
                    <span className="animate-startUp transition-all ">
                        <DividerVerticalIcon className="size-3 animate-spin " />
                    </span>
                )}
                {gameState === "completed" && (
                    <span>
                        <CheckIcon className="size-3" />
                    </span>
                )}
            </div>
            {(gameState === "idle" || gameState === "out-of-focus") && (
                <div className={"flex items-center"}>{shortcutInfo && `(${shortcutInfo.hotkeys.join(",")}) to restart`}</div>
            )}
        </>
    )
}

interface CompleteAnimationsProps {
    song: Song
}
interface CompleteAnimationsRef {
    triggerCompleteAnim: () => void
}

const CompleteAnimations = forwardRef<CompleteAnimationsRef, CompleteAnimationsProps>(({ song }, ref) => {
    const [animKey, setAnimKey] = useState(0)

    useImperativeHandle(ref, () => ({
        triggerCompleteAnim: () => {
            setAnimKey((prev) => prev + 1)
        },
    }))

    return <CompletionAnim index={animKey} song={song} />
})

const RestartButton = ({ handleRestart }: { handleRestart: () => void }) => {
    const shortcutInfo = useShortcutInfo(TYPER_SHORTCUTS.RESTART)
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button className=" text-xs" variant={"ghost"} size={"icon"} onClick={handleRestart}>
                        <ReloadIcon />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Restart </p>
                    <ShortcutKeys shortcut={shortcutInfo} />
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

interface InputAnimationsRef {
    triggerCorrectAnim: () => void
    triggerErrorAnim: () => void
}

const InputAnimations = forwardRef<InputAnimationsRef, { source: Song }>(({ source }, ref) => {
    const [correctAnimKey, setCorrectAnimkey] = useState(0)
    const [errorAnimeKey, seErrorAnimeKey] = useState(0)

    useImperativeHandle(ref, () => ({
        triggerCorrectAnim: () => {
            setCorrectAnimkey((prev) => prev + 1)
        },
        triggerErrorAnim: () => {
            seErrorAnimeKey((prev) => prev + 1)
        },
    }))

    return (
        <>
            <CorrectAnim index={correctAnimKey} song={source} />
            <ErrorAnim index={errorAnimeKey} />
        </>
    )
})

interface TimerProps {
    gameState: GameState
}

interface TimerRef {
    getCurrentTime: () => number
}

const Timer = forwardRef<TimerRef, TimerProps>(({ gameState }, ref) => {
    const {
        totalSeconds,
        start: startStopwatch,
        pause: pauseStopwatch,
        reset: resetStopwatch,
        isRunning,
    } = useStopwatch({
        autoStart: false,
    })

    useEffect(() => {
        if (gameState === "idle") {
            resetStopwatch(undefined, false)
        } else if (gameState === "started") {
            // Check otherwise startStopwatch will reset the values
            if (!isRunning) {
                startStopwatch()
            }
        } else if (gameState === "completed") {
            pauseStopwatch()
        }
    }, [gameState, isRunning, pauseStopwatch, resetStopwatch, startStopwatch])

    useImperativeHandle(ref, () => ({
        getCurrentTime: () => totalSeconds,
    }))

    return <div>{totalSeconds}s</div>
})

type Verses = { target: string; charCount: number }[][]
type InputHistory = string[]
interface TyperProps {
    gameState: GameState
    source: Song
    stateActions: {
        startGame: () => void
        handleLostFocus: () => void
        handleReceivedFocus: () => void
        handleCompletion: () => void
        handleRestart: () => void
    }
    content: string
    onInput: (prevInput: string, newInput: string, target: string) => void
    renderDisplay: RenderDispalyFunc
}
interface TyperRef {
    getStats: () => TypingStats
}

function replaceWithDifferentChar(input: string): string {
    const allChars = "xz"

    return input
        .split("")
        .map((char) => {
            // Filter out the current character from the replacement pool
            const possibleReplacements = allChars.split("").filter((c) => c !== char)

            // Pick a random replacement from the filtered list
            return possibleReplacements[Math.floor(Math.random() * possibleReplacements.length)]
        })
        .join("")
}

const Typer = forwardRef<TyperRef, TyperProps>(
    ({ gameState, content, stateActions, source, onInput: onInputChange, renderDisplay }, ref) => {
        const songSplit = useMemo(() => content.split(/\n\s*\n/) || [], [content])
        const verses: Verses = useMemo(
            () =>
                songSplit.map((verse) =>
                    verse.split(/\r?\n/).map((line) => ({
                        target: line,
                        charCount: line.length,
                    }))
                ),
            [songSplit]
        )
        const lines = useMemo(() => verses.flat(), [verses])
        const totalCharCount = useMemo(() => {
            return lines.map((line) => line.charCount).reduce((prev, curr) => prev + curr)
        }, [lines])
        const linesCombinedIntoString = useMemo(() => lines.map((line) => line.target).join(""), [lines])

        const [inputHistory, setInputHistory] = useState<InputHistory>([])
        const [currentInput, setCurrentInput] = useState("")

        const [skipLineUsed, setSkipLineUsed] = useState(false)

        // It's a ref because this component doesn't need the stats, no need to rerender
        // Also because async nature of state it means getStats would be getting old state
        const statTracker = useRef<TypingStats>({
            correct: 0,
            incorrect: 0,
            current: 0,
            total: totalCharCount,
            errorMap: new Set<number>(),
            skipLineUsed: skipLineUsed,
        })
        const inputRef = useRef<HTMLTextAreaElement>(null)

        useImperativeHandle(ref, () => ({
            getStats: () => statTracker.current,
        }))

        const onInput = (newVal: string) => {
            if (gameState !== "started" && gameState !== "idle") {
                return
            }

            // If the last char entered is a \n, which is treated as a shortcut to skip the line, this will modify the input to make it
            // work
            // This finds the current line, then takes the remainder of the line, replaces all its chars with incorrect values, and
            // finally updates the input
            if (newVal.endsWith("\n")) {
                let endOfLineCharCount = 0
                let startOfLineCharCount = 0
                for (const line of lines) {
                    startOfLineCharCount = endOfLineCharCount
                    endOfLineCharCount += line.charCount
                    // Found current line
                    if (newVal.length <= endOfLineCharCount) {
                        // Get the remainder of the line by slicing the line.target from howFarIntoLine - 1 (-1 for the \n char), to the
                        // end of the line.
                        const howFarIntoLine = newVal.length - startOfLineCharCount
                        const remainderOfLine = line.target.slice(howFarIntoLine - 1, line.target.length)

                        // It takes the remainder of the line and replaces each char with something else to make it incorrect
                        // It also replaces the last char with a whitespace because otherwise the input will be a single line, and
                        // ctrl+backspace will remove everything
                        const incorrectValues = replaceWithDifferentChar(remainderOfLine).slice(0, -1) + " "
                        newVal = newVal.replace(/\n/g, incorrectValues)
                        setSkipLineUsed(true)
                        break
                    }
                }
            }

            setCurrentInput(newVal)
            onInputChange(currentInput, newVal, linesCombinedIntoString)

            let count = 0
            let lineIndex = 0
            for (const line of lines) {
                count += line.charCount
                if (newVal.length <= count) {
                    if (lineIndex == 0) {
                        // First line
                        setInputHistory([newVal.slice(0, count)])
                    } else {
                        setInputHistory((prev) => {
                            return [...prev.slice(0, lineIndex), newVal.slice(count - line.charCount, count)]
                        })
                    }
                    break
                }
                lineIndex++
            }

            // Stat tracking
            let correct = 0
            let incorrect = 0
            const errorMap = new Set<number>(statTracker.current.errorMap)

            // Go through input and check against the target (that is combined into a single line)
            Array.from(newVal).forEach((ch, index) => {
                if (ch === linesCombinedIntoString[index]) {
                    correct++
                } else {
                    incorrect++
                    errorMap.add(index)
                }
            })
            statTracker.current = {
                correct: correct,
                incorrect: incorrect,
                current: newVal.length,
                total: totalCharCount,
                errorMap: errorMap,
                skipLineUsed: skipLineUsed,
            }

            // I don't like how this is done because it starts before game state is in started
            if (gameState === "idle") {
                stateActions.startGame()
            }

            // Check if completed
            // Can also check last line to see if it's full,
            if (newVal.length >= totalCharCount) {
                // maybe completion passes in all the data
                stateActions.handleCompletion()
            }
        }

        // The last non-empty array in input history is the current line
        // Go from the end to find the first one
        function findLastNonEmptyIndex(): number {
            for (let i = inputHistory.length - 1; i >= 0; i--) {
                if (inputHistory[i].length > 0) {
                    // Check if this line is full (completed) if so use the next line, as that will be the new current
                    if (i < lines.length && inputHistory[i].length == lines[i].charCount) {
                        // This code is still messy in places man ;-;
                        return i + 1
                    }

                    return i
                }
            }

            return 0 // Return 0 if all arrays are empty
        }

        useHotkeys("*", (event) => {
            const { key } = event
            // Check if input is letters, numbers, punctuation or backspace
            if (isTryingToType(key)) {
                inputRef.current?.focus()
                if (gameState === "out-of-focus") {
                    stateActions.handleReceivedFocus()
                }
                if (gameState === "idle") {
                    stateActions.startGame()
                }
            }
        })

        const restart = useCallback(() => {
            setInputHistory([])
            setCurrentInput("")
            statTracker.current = {
                correct: 0,
                incorrect: 0,
                current: 0,
                total: totalCharCount,
                errorMap: new Set<number>(),
                skipLineUsed: false,
            }
            stateActions.handleRestart()
        }, [totalCharCount, stateActions])

        useEffect(() => {
            if (gameState === "idle") {
                restart()
            }
        }, [gameState, restart])

        // TODO : I don't like how textarea is done, hidden away like that
        return (
            <>
                <Textarea
                    value={currentInput}
                    onChange={(e) => onInput(e.target.value)}
                    className=" border fixed -top-32 -left-32 w-0 h-0 opacity-0"
                    autoFocus={true}
                    ref={inputRef}
                    disabled={gameState === "completed"}
                    onFocus={() => stateActions.handleReceivedFocus()}
                    onBlur={() => stateActions.handleLostFocus()}
                />

                {renderDisplay({ verses: verses, inputHistory: inputHistory, currentLine: findLastNonEmptyIndex(), source: source })}
            </>
        )
    }
)

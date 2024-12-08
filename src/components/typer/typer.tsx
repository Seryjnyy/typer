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
import { useTyperShortcuts } from "@/lib/hooks/use-typer-shortcuts.ts"

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
    const renderTestProps = useRef<{ getStats: () => TypingStats }>(null)
    useTyperShortcuts({ onShortcut: () => handleRestart() })

    const startGame = () => {
        dispatch({ type: StateActionKind.START })
    }

    const handleCompletion = useCallback(() => {
        dispatch({ type: StateActionKind.COMPLETE })

        onCompletion?.({
            stats: {
                ...(renderTestProps.current?.getStats() ?? { current: 0, errorMap: new Set(), correct: 0, total: 0, incorrect: 0 }),
                time: timerRef.current?.getCurrentTime() ?? 0,
            },
            textMods: txtMods,
            source: source,
        })

        completeAnimationsRef.current?.triggerCompleteAnim()
    }, [onCompletion, renderTestProps, source, txtMods])

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
            {/*<div className={"fixed top-3 left-3 text-xs text-muted-foreground"}>{state}</div>*/}

            <div className="absolute sm:bottom-2 bottom-14 left-2 text-xs text-muted-foreground flex items-center gap-1 z-0">
                <Timer gameState={state} ref={timerRef} />
                {renderTestProps.current && timerRef.current && (
                    <WPM gameState={state} getStats={renderTestProps.current?.getStats} getTime={getTime} />
                )}
                <Indicators gameState={state} />
            </div>
            <div className="absolute sm:bottom-1 bottom-14 right-2 z-40 flex items-center gap-2">
                <RestartButton handleRestart={handleRestart} />
                <TextModificationDialog />
            </div>
            <Typer
                source={source}
                ref={renderTestProps}
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
                    stats: renderTestProps.current?.getStats() ?? { current: 0, total: 0, correct: 0, errorMap: new Set(), incorrect: 0 },
                    difficultyModsUsed: txtMods,
                    time: timerRef.current?.getCurrentTime() ?? 0,
                    source: source,
                    handleRestart: handleRestart,
                })}
            {renderDecorations?.({ source: source })}
        </div>
    )
}

const WPM = ({ gameState, getStats, getTime }: { gameState: GameState; getTime: () => number; getStats: () => TypingStats }) => {
    const [isRunning, setIsRunning] = useState(false)
    const [wpm, setWpm] = useState(0)
    useEffect(() => {
        if (gameState === "idle") {
            setWpm(0)
            setIsRunning(false)
        } else if (gameState === "started") {
            if (!isRunning) setIsRunning(true)
        } else if (gameState === "completed") {
            setIsRunning(false)
        }
    }, [gameState, isRunning])

    useEffect(() => {
        let intervalId: NodeJS.Timeout

        // Fetch time and stats every second
        if (isRunning) {
            intervalId = setInterval(() => {
                const stats = getStats()
                const time = getTime()
                if (time === 0) {
                    setWpm(stats.current)
                } else {
                    setWpm(calcWpm(stats.current, time))
                }
            }, 1000)
        }

        // Cleanup function to clear the interval
        return () => {
            if (intervalId) {
                clearInterval(intervalId)
            }
        }
    }, [getStats, getTime, isRunning])

    return <div className={"border-l pl-1"}>{wpm}wpm</div>
}

const Indicators = ({ gameState }: { gameState: GameState }) => {
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
            {(gameState === "idle" || gameState === "out-of-focus") && <div className={"flex items-center"}>(esc) to restart</div>}
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
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button className=" text-xs" variant={"ghost"} size={"icon"} onClick={handleRestart}>
                        <ReloadIcon />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Restart (esc)</p>
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

        // It's a ref because this component doesn't need the stats, no need to rerender
        // Also because async nature of state it means getStats would be getting old state
        const statTracker = useRef<TypingStats>({
            correct: 0,
            incorrect: 0,
            current: 0,
            total: totalCharCount,
            errorMap: new Set<number>(),
        })
        const inputRef = useRef<HTMLTextAreaElement>(null)

        useImperativeHandle(ref, () => ({
            getStats: () => statTracker.current,
        }))

        const onInput = (newVal: string) => {
            if (gameState !== "started" && gameState !== "idle") {
                return
            }

            setCurrentInput(newVal)
            onInputChange(currentInput, newVal, linesCombinedIntoString)

            let count = 0
            let index = 0
            for (const line of verses.flat()) {
                count += line.charCount
                if (newVal.length <= count) {
                    if (index == 0) {
                        // First line
                        setInputHistory([newVal.slice(0, count)])
                    } else {
                        setInputHistory((prev) => {
                            return [...prev.slice(0, index), newVal.slice(count - line.charCount, count)]
                        })
                    }
                    break
                }
                index++
            }

            // Stat tracking
            let correct = 0
            let incorrect = 0
            const errorMap = new Set<number>(statTracker.current.errorMap)
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

// focused

import React, {
    createRef,
    forwardRef,
    memo,
    RefObject,
    useEffect,
    useReducer,
    useRef,
    useState,
} from "react"
import { useCurrentSong } from "@/test/useTest.tsx"
import { ScrollArea } from "@/components/ui/scroll-area.tsx"
import { cn } from "@/lib/utils.ts"
import Ch, { chVariant } from "@/components/ch.tsx"
import { useTextModificationsStore } from "@/lib/store/text-modifications-store.tsx"
import { Textarea } from "@/components/ui/textarea.tsx"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip.tsx"
import KeyboardButton from "@/components/keyboard-button.tsx"
import TextModificationDialog from "@/routes/typer/cylinder/text-modification-dialog.tsx"
import NoSongSelected from "@/routes/typer/no-song-selected.tsx"
import { useStopwatch } from "react-timer-hook"
import { Song } from "@/lib/types.ts"
import { Button } from "@/components/ui/button.tsx"

// idle -> started -> (paused, out of focus)
// paused -> started
// paused -> idle
// out of focus -> started
// out of focus -> started
// started -> completed
// completed -> results

type State = "idle" | "started" | "paused" | "out-of-focus" | "completed"

enum StateActionKind {
    START = "START",
    PAUSE = "PAUSE",
    RESTART = "RESTART",
    RECEIVED_FOCUS = "RECEIVED_FOCUS",
    LOST_FOCUS = "LOST_FOCUS",
}

interface StateAction {
    type: StateActionKind
}

function reducer(state: State, action: StateAction): State {
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
        default:
            return state
    }
}

// const GameEngine = () => {
//     const song = useCurrentSong()
//     const processedSongContent = useProcessedSongContent(song)
//
//     const [state, dispatch] = useReducer(reducer, 'B')
// }
export const UseThis = () => {
    return <SongProvider />
}

const SongProvider = () => {
    const currentSong = useCurrentSong()

    if (!currentSong) return <NoSongSelected />

    return <GameEngine song={currentSong} />
}

const GameEngine = ({ song }: { song: Song }) => {
    const [state, dispatch] = useReducer(reducer, "idle")
    const {
        totalSeconds,
        start: startStopwatch,
        pause: pauseStopwatch,
        reset: resetStopwatch,
    } = useStopwatch({
        autoStart: false,
    })

    const startGame = () => {
        dispatch({ type: StateActionKind.START })
    }

    return (
        <div>
            <div>game state : {state}</div>
            <TyperPageTest />
        </div>
    )
}
interface PassItOn {
    gameState: State
}

function TyperPageTest({ gameState }: PassItOn) {
    // const [state, setState] = useState<State>("idle")
    // const [input, setInput] = useState('')
    // const [state, dispatch] = useReducer(reducer, 'idle')
    // const { versesResult, verses } = useCalculateStuff({ input: input })
    // const updateState = (newState:State) => {
    //
    // }
    const currentSong = useCurrentSong()

    return (
        <div className="relative h-full w-full   rounded-md overflow-hidden">
            <ScrollArea className="h-full  relative z-10">
                <div className="w-full h-full ">
                    <div className="flex justify-start">
                        <div className="flex justify-center w-full py-24 relative">
                            <div className="text-2xl font-semibold flex flex-col text-center px-1 sm:px-2  ">
                                <RenderTest
                                    content={currentSong?.content ?? ""}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>
            {/*<div>{focused ? "focused" : "not focused"}</div>*/}
            {/*<div tabIndex={-1} onBlur={() => dispatch({type:StateActionKind.LOST_FOCUS})} onFocus={() => dispatch({type:StateActionKind.RECEIVED_FOCUS})}>something</div>*/}
        </div>
    )
}

// verses should never change
// versesResults and input will change
const RenderTest = ({ gameState, content }: PassItOn & { content: string }) => {
    // memo all of this
    const songSplit = content.split(/\n\s*\n/) || []
    const verses = songSplit.map((verse) =>
        verse
            .split(/\r?\n/)
            .map((line) => ({ target: line, charCount: line.length }))
    )
    const lines = verses.flat()
    const totalCharCount = lines
        .map((line) => line.charCount)
        .reduce((prev, curr) => prev + curr)

    const [inputHistory, setInputHistory] = useState<string[]>([])
    const [currentInput, setCurrentInput] = useState("")
    const [statTracker, setStatTracker] = useState({
        correct: 0,
        incorrect: 0,
        current: 0,
        total: totalCharCount,
        errorMap: new Set<number>(),
    })

    const onInput = (newVal: string) => {
        // if (newVal.length >= verse[currentLine].charCount) {
        //     setCurrentInput('')
        // }
        // console.log('==============================================')
        // console.log('newVal is', newVal)
        setCurrentInput(newVal)

        let count = 0
        let index = 0
        for (const line of verses.flat()) {
            count += line.charCount
            if (newVal.length <= count) {
                // console.log(
                //     'input is on line',
                //     index,
                //     'count is',
                //     count,
                //     'newVal is',
                //     newVal.length
                // )

                if (index == 0) {
                    // first line

                    setInputHistory([newVal.slice(0, count)])
                    // setCurrentLine(index)
                    // if (newVal.length === count) {
                    //     setCurrentLine(index + 1)
                    // }
                } else {
                    // console.log(
                    //     'setting',
                    //     newVal.slice(count - line.charCount, count)
                    // )
                    setInputHistory((prev) => {
                        return [
                            ...prev.slice(0, index),
                            newVal.slice(count - line.charCount, count),
                        ]
                    })
                    // if (newVal.length < count) {
                    //     setCurrentLine(index + 1)
                    // }
                }
                break
            }
            index++
        }

        // Stat tracking
        let correct = 0
        let incorrect = 0
        const l = lines.map((line) => line.target).join("")
        const errorMap = new Set<number>(statTracker.errorMap)
        Array.from(newVal).forEach((ch, index) => {
            if (ch == l[index]) {
                correct++
            } else {
                incorrect++
                errorMap.add(index)
            }
        })
        setStatTracker({
            correct: correct,
            incorrect: incorrect,
            current: newVal.length,
            total: totalCharCount,
            errorMap: errorMap,
        })

        // const correct = l.filter((ch, index) => ch == newVal[index]).length
        // const incorrect = l.filter((ch, index) => ch != newVal[index]).length
        // const current = newVal.length
        // const total = l.length
        // console.log('==============================================')
    }

    // new line should be derived state from input, input history
    // the last not empty array in input history is current line

    function findLastNonEmptyIndex(inputHistory: string[]): number {
        for (let i = inputHistory.length - 1; i >= 0; i--) {
            if (inputHistory[i].length > 0) {
                if (inputHistory[i].length == lines[i].charCount) {
                    return i + 1
                }

                return i
            }
        }
        // if the last array is full, then consider the next one as the current one

        return 0 // Return 0 if all arrays are empty
    }

    const currentLine = findLastNonEmptyIndex(inputHistory)

    return (
        <>
            <Textarea
                value={currentInput}
                onChange={(e) => onInput(e.target.value)}
                className=" border fixed top-0  "
                autoFocus={true}
                // ref={inputRef}
                // disabled={progressManager.completed}
                // onFocus={() => setFocusedOnInput(true)}
                // onBlur={() => setFocusedOnInput(false)}
                // onKeyDown={(e) => handleKeyDown(e)}
            />
            <div className={"flex flex-col gap-2 font-mono"}>
                <Display
                    verses={verses}
                    inputHistory={inputHistory}
                    currentLine={currentLine}
                    tryVerseOption={true}
                />
            </div>
            <div>{currentLine >= lines.length && "completed"} </div>
            <div>{`${currentLine} - ${lines.length}`} </div>
            <TextModificationDialog />
            <div>
                <div>{`correct : ${statTracker.correct} incorrect: ${statTracker.incorrect} mistakes ${statTracker.errorMap.size} soFar: ${statTracker.current} total: ${statTracker.total}`}</div>
            </div>
            <Button
                onClick={() => {
                    setInputHistory([])
                    setCurrentInput("")
                    setStatTracker({
                        correct: 0,
                        incorrect: 0,
                        current: 0,
                        total: totalCharCount,
                        errorMap: new Set<number>(),
                    })
                }}
            >
                restart
            </Button>
        </>
    )
}

const Display = ({
    verses,
    tryVerseOption,
    inputHistory,
    currentLine,
}: {
    verses: { target: string; charCount: number }[][]
    tryVerseOption: boolean
    inputHistory: string[]
    currentLine: number
}) => {
    const refs = useRef(new Map<number, RefObject<HTMLDivElement>>())

    const getLineRef = (index: number) => {
        if (!refs.current?.get(index)) {
            refs.current.set(index, createRef())
        }
        return refs.current?.get(index)
    }

    const getEquivalentInput = (index: number) => {
        // this will take the current line index and try to get a value from inputHistory for that line
        // nothing if not yet covered
        if (index > inputHistory.length - 1) return ""
        if (index < 0) return ""

        return inputHistory[index]
    }

    useEffect(() => {
        refs.current.get(currentLine)?.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        })
    }, [currentLine, verses])

    let lineIndex = -1
    return (
        <ol>
            {verses.map((verse, vIndex) => (
                <li key={vIndex}>
                    <ol
                        className={cn(
                            " mb-4 p-2 rounded-md relative group/verse sm:leading-8 leading-10",
                            {
                                "hover:outline": tryVerseOption,
                            }
                        )}
                    >
                        {verse.map((line) => {
                            lineIndex++
                            return (
                                <LineTest
                                    ref={getLineRef(lineIndex)}
                                    key={lineIndex}
                                    isCurrentLine={lineIndex === currentLine}
                                    line={line.target}
                                    input={getEquivalentInput(lineIndex)}
                                />
                            )
                        })}
                        {tryVerseOption && (
                            <TooltipProvider delayDuration={1200}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <KeyboardButton
                                            // onClick={() => onClickVerse?.(verse)}
                                            variant={"verse"}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent className="group-hover/verse:block hidden">
                                        <p>Attempt this part only</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </ol>
                    {vIndex < verses.length - 1 && (
                        <span className="py-4 mx-auto opacity-50 text-md font-normal">
                            {"𝆕"}
                        </span>
                    )}
                </li>
            ))}
        </ol>
    )
}

interface LineTestProps {
    line: string
    input: string
    isCurrentLine: boolean
}

const LineTestBase = forwardRef<HTMLDivElement, LineTestProps>(
    ({ line, input, isCurrentLine }, ref) => {
        // console.log('rerender line', line, 'input', input)
        const difficultyModifiers =
            useTextModificationsStore.use.harderOptions()

        if (isCurrentLine) {
            console.log("current", line)
        }
        return (
            <div className={"tracking-wide"} ref={ref}>
                {line.split("").map((ch, index) => {
                    const char = input.at(index)

                    let variant: chVariant

                    if (char === ch) {
                        variant = "correct"
                    } else if (index >= input.length) {
                        if (isCurrentLine) {
                            variant =
                                index === input.length
                                    ? "current"
                                    : "not-covered"
                        } else {
                            variant = "not-covered"
                        }
                    } else {
                        if (ch == " " || ch == "\n") {
                            variant = "incorrect"
                            ch = "_"
                        } else {
                            variant = "incorrect"
                        }
                    }

                    if (variant != "correct" && variant != "incorrect") {
                        // current, not covered

                        if (isCurrentLine) {
                            if (difficultyModifiers.cantSeeAhead) {
                                if (ch != " " && input.length !== index) {
                                    ch = "_"
                                }

                                if (difficultyModifiers.cantSeeCurrent) {
                                    ch = "_"
                                }

                                if (
                                    difficultyModifiers.cantSeeUnderlines &&
                                    input.length !== index
                                ) {
                                    variant = "normalInvisible"
                                }
                            }
                        } else {
                            if (difficultyModifiers.cantSeeAhead) {
                                if (ch != " ") {
                                    ch = "_"
                                }

                                if (difficultyModifiers.cantSeeUnderlines) {
                                    variant = "normalInvisible"
                                }
                            }
                        }
                    }

                    return (
                        <Ch key={`char-${index}`} variant={variant}>
                            {ch}
                        </Ch>
                    )
                })}
            </div>
        )
    }
)

const LineTest = memo(LineTestBase)

export default TyperPageTest

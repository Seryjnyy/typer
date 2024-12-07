import { createRef, RefObject, useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area.tsx"
import { cn } from "@/lib/utils.ts"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx"
import KeyboardButton from "@/components/keyboard-button.tsx"

const Display = ({
    verses,
    tryVerse,
    inputHistory,
    currentLine,
}: {
    verses: { target: string; charCount: number }[][]
    tryVerse?: (verse: string) => void
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
        <div className="relative h-full w-full   rounded-md overflow-hidden">
            <ScrollArea className="h-full  relative z-10 ">
                <div className="w-full h-full ">
                    <div className="flex justify-start">
                        <div className="flex justify-center w-full py-24 relative">
                            <div className="text-2xl font-semibold flex flex-col text-center px-1 sm:px-2 ">
                                <ol>
                                    {verses.map((verse, vIndex) => (
                                        <li key={vIndex}>
                                            <ol
                                                className={cn(
                                                    " mb-4 p-2 rounded-md relative group/verse sm:leading-8 leading-10  font-mono",
                                                    {
                                                        "hover:outline": !!tryVerse,
                                                    }
                                                )}
                                            >
                                                {verse.map((line) => {
                                                    lineIndex++
                                                    return (
                                                        <Line
                                                            ref={getLineRef(lineIndex)}
                                                            key={lineIndex}
                                                            isCurrentLine={lineIndex === currentLine}
                                                            line={line.target}
                                                            input={getEquivalentInput(lineIndex)}
                                                        />
                                                    )
                                                })}
                                                {tryVerse && (
                                                    <TooltipProvider delayDuration={1200}>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <KeyboardButton
                                                                    onClick={() => {
                                                                        tryVerse(verse.map((line) => line.target).join("\n"))
                                                                    }}
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
                                                <span className="py-4 mx-auto opacity-50 text-md font-normal">{"𝆕"}</span>
                                            )}
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}

import { forwardRef, memo } from "react"
import { useTextModificationsStore } from "@/lib/store/text-modifications-store.tsx"
import Ch, { chVariant } from "@/components/ch.tsx"

interface LineBaseProps {
    line: string
    input: string
    isCurrentLine: boolean
}

const LineBase = forwardRef<HTMLDivElement, LineBaseProps>(({ line, input, isCurrentLine }, ref) => {
    const difficultyModifiers = useTextModificationsStore.use.harderOptions()

    return (
        <div className={"tracking-wide"} ref={ref}>
            {line.split("").map((ch, index) => {
                const char = input.at(index)

                let variant: chVariant

                if (char === ch) {
                    variant = "correct"
                } else if (index >= input.length) {
                    if (isCurrentLine) {
                        variant = index === input.length ? "current" : "not-covered"
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

                            if (difficultyModifiers.cantSeeUnderlines && input.length !== index) {
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
})

const Line = memo(LineBase)

export default Display

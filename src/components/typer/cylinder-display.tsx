import { createRef, RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons"
import { Progress } from "@/components/ui/progress.tsx"
import { useHotkeys } from "react-hotkeys-hook"
import { throttle } from "lodash"
import { cn } from "@/lib/utils.ts"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx"
import KeyboardButton from "@/components/keyboard-button.tsx"
import { ArrowDown, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button.tsx"
import { useMediaQuery } from "react-responsive"
import Line from "@/components/typer/typer-line.tsx"

function linearMap(x: number, maxVal: number, to: number): number {
    return (x / maxVal) * to
}

const calcLineStyle = (offsetFromCenter: number, maxOffsetFromCenter: number) => {
    const angleStep = 80 / maxOffsetFromCenter
    const transform = `rotateX(${offsetFromCenter * angleStep}deg)`
    const fontSizeOffset = 10 - Math.abs(offsetFromCenter)
    const fontSizeModifier = 3
    const fontSize = fontSizeOffset * fontSizeModifier
    const fontWeight = offsetFromCenter === 0 ? "bold" : "normal"

    const s = linearMap(Math.abs(offsetFromCenter), maxOffsetFromCenter, 0.7)
    const opacity = 1 - (offsetFromCenter !== 0 ? s + 0.3 : s)

    return { transform, fontSize, fontWeight, opacity }
}

const CylinderDisplay = ({
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
    const [currentlyViewingLine, setCurrentlyViewingLine] = useState(0)
    const scrollDivRef = useRef<HTMLDivElement>(null)
    const isMd = useMediaQuery({
        query: "(min-width: 768px)",
    })
    const lineCount = useMemo(() => {
        return verses.map((verse) => verse.length).reduce((a, b) => a + b, 0)
    }, [verses])

    // The higher the delay the smoother the scroll but then it just flies through everything
    const handleScroll = throttle((event: WheelEvent) => {
        if (scrollDivRef.current) {
            if (event.deltaY > 0) {
                changeViewingOffset(1)
            } else if (event.deltaY < 0) {
                changeViewingOffset(-1)
            }
        }
    }, 300)

    // TODO : Im finding this scroll implementation a tiny bit annoying, idk if its the throttle or what
    //  but at the end of scrolling it goes to the last line, then goes back one as a final move
    useEffect(() => {
        const div = scrollDivRef.current
        if (div) {
            div.addEventListener("wheel", handleScroll)

            return () => {
                div.removeEventListener("wheel", handleScroll)
            }
        }
    }, [handleScroll])

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

    let lineIndex = -1
    const MAX_LINES = 12
    const center = Math.floor(MAX_LINES / 2)
    const maxOffsetFromCenter = center

    const changeViewingOffset = (amount: number) => {
        const newLine = currentlyViewingLine + amount
        if (newLine < 0 || newLine >= lineCount) return

        setCurrentlyViewingLine(newLine)
    }

    useHotkeys(
        "ArrowLeft,ArrowUp",
        () => {
            changeViewingOffset(-1)
        },
        { enableOnFormTags: true }
    )

    useHotkeys(
        "ArrowRight,ArrowDown",
        () => {
            changeViewingOffset(1)
        },
        { enableOnFormTags: true }
    )

    // It checks which verse and line should be rendered, and returns the line with that info
    // Use the currently viewing index which represents, which line is being looked at, to create a window around the current line.
    // Anything inside that range should be rendered
    const checkVerses = useCallback(() => {
        const start = currentlyViewingLine - center
        const end = currentlyViewingLine + center

        let lineIndex = 0

        return verses.map((verse) => {
            return verse.map((line) => {
                if (lineIndex >= start && lineIndex <= end) {
                    lineIndex++
                    return { ...line, render: true }
                }
                lineIndex++
                return { ...line, render: false }
            })
        })
    }, [center, verses, currentlyViewingLine])

    useEffect(() => {
        setCurrentlyViewingLine(currentLine)
    }, [currentLine])

    useEffect(() => {
        // Have to add this because when currentLine is 0 when song switches then the other useEffect will not fire, and so currentlyViewingLine will not change
        setCurrentlyViewingLine(currentLine)
    }, [verses, currentLine])

    const checkedVerses = useMemo(() => checkVerses(), [checkVerses])

    // TODO : idk about they styling around the component, tons of divs with classes, and it doesn't really do much.
    //  also duplicate code with flat typer.
    return (
        <div className="relative h-full w-full   rounded-md overflow-hidden" ref={scrollDivRef}>
            <div className="absolute   top-2    right-[50%] translate-x-[50%] opacity-60 z-40">
                <div className={"flex flex-col items-center gap-2"}>
                    <div className="flex items-center gap-2 text-primary">
                        <ChevronLeftIcon />
                        <Progress value={((currentlyViewingLine + 1) / lineCount) * 100} className="w-[5rem]" />
                        <ChevronRightIcon />
                    </div>
                    <div>
                        <Button
                            size={"sm"}
                            variant={"ghost"}
                            disabled={currentlyViewingLine === currentLine}
                            className={cn({
                                invisible: currentlyViewingLine === currentLine,
                            })}
                            onClick={() => setCurrentlyViewingLine(currentLine)}
                        >
                            {currentlyViewingLine > currentLine && <ArrowUp className={"size-3"} />}
                            {currentlyViewingLine < currentLine && <ArrowDown className={"size-3"} />}
                        </Button>
                    </div>
                </div>
            </div>
            <div>
                <div className="w-full h-full ">
                    <div className="flex justify-start">
                        <div className="flex justify-center w-full py-24 relative">
                            <div className="text-2xl font-semibold flex flex-col text-center px-1 sm:px-2 ">
                                <ol>
                                    {checkedVerses.map((verse, vIndex) => {
                                        let isVerseEmpty = false

                                        const lines = verse
                                            .map((line) => {
                                                lineIndex++
                                                const style = calcLineStyle(lineIndex - currentlyViewingLine, maxOffsetFromCenter)

                                                if (!line.render) return null

                                                return (
                                                    <div
                                                        style={{
                                                            transform: style.transform,
                                                            fontSize: `${style.fontSize * (isMd ? 1 : 0.6)}px`,
                                                            lineHeight: 1,
                                                            fontWeight: style.fontWeight,
                                                            opacity: style.opacity,
                                                        }}
                                                    >
                                                        <Line
                                                            ref={getLineRef(lineIndex)}
                                                            key={lineIndex}
                                                            isCurrentLine={lineIndex === currentLine}
                                                            line={line.target}
                                                            input={getEquivalentInput(lineIndex)}
                                                        />
                                                    </div>
                                                )
                                            })
                                            .filter((x) => x !== null)

                                        if (lines.length === 0) isVerseEmpty = true

                                        return (
                                            <li key={vIndex}>
                                                <ol
                                                    className={cn(
                                                        " mb-4 p-2 rounded-md relative sm:leading-8 leading-10  font-mono group/verse",
                                                        {
                                                            "hover:outline": !!tryVerse && !isVerseEmpty,
                                                        }
                                                    )}
                                                >
                                                    {lines}
                                                    {tryVerse && !isVerseEmpty && (
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
                                                {/* TODO : Would need to calc style for this too*/}
                                                {/*{vIndex < verses.length - 1 && isVerseEmpty && (*/}
                                                {/*    <span className="py-4 mx-auto opacity-50 text-md font-normal">{"𝆕"}</span>*/}
                                                {/*)}*/}
                                            </li>
                                        )
                                    })}
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CylinderDisplay

import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"

import { textModification } from "@/lib/utils"
import { CaretDownIcon, Cross1Icon, InfoCircledIcon, ResetIcon } from "@radix-ui/react-icons"
import { useMemo, useState } from "react"
import { ControllerRenderProps, FieldValues, useFormContext } from "react-hook-form"
import { CreateSongSchemaType } from "@/lib/schemas/song.ts"

const MAX_HISTORY_LENGTH = 10

// TODO : turn redo/undo into hook, or use the one from useHooks
export default function ContentFormFieldItem({
    changeIndicator,
    field,
}: {
    changeIndicator?: boolean
    field: ControllerRenderProps<FieldValues, string>
}) {
    const form = useFormContext<CreateSongSchemaType>()

    const [history, setHistory] = useState<string[]>([field.value])
    const currentValue = useMemo(() => {
        return history.length > 0 ? history[history.length - 1] : ""
    }, [history])
    const [redoHistory, setRedoHistory] = useState<string[]>([])

    const updateHistory = (val: string, updateRedoHistory?: boolean) => {
        setHistory((prev) => {
            const newHistory = [...prev, val]

            if (newHistory.length > MAX_HISTORY_LENGTH) {
                newHistory.splice(0, newHistory.length - MAX_HISTORY_LENGTH)
                return newHistory
            }

            return newHistory
        })

        if (updateRedoHistory == true) {
            setRedoHistory([])
        }

        form.setValue("content", val)
    }

    // on user input log history
    const handleUserInput = (val: string) => {
        updateHistory(val, true)
    }

    const undo = () => {
        if (history.length <= 1) return

        setRedoHistory((prev) => {
            const newHistory = [...prev, currentValue] // current value being the value before undo
            return newHistory
        })

        const newHistory = history.slice(0, history.length - 1)
        setHistory(() => {
            return newHistory
        })
        const newCurrentValue = newHistory.length > 0 ? newHistory[newHistory.length - 1] : ""
        form.setValue("content", newCurrentValue)
    }

    const redo = () => {
        if (redoHistory.length == 0) return

        updateHistory(redoHistory[redoHistory.length - 1], false)
        setRedoHistory((prev) => prev.slice(0, prev.length - 1))
    }

    const handleUseSmallerCase = () => {
        updateHistory(
            textModification(currentValue, {
                letterCase: "lower",
                numbers: "normal",
                punctuation: "normal",
            }),
            true
        )
    }

    const handleUseUpperCase = () => {
        updateHistory(
            textModification(currentValue, {
                letterCase: "upper",
                numbers: "normal",
                punctuation: "normal",
            }),
            true
        )
    }

    const handleRemoveNumbers = () => {
        updateHistory(
            textModification(currentValue, {
                letterCase: "normal",
                numbers: "removed",
                punctuation: "normal",
            }),
            true
        )
    }

    const handleRemovePunctuation = () => {
        updateHistory(
            textModification(currentValue, {
                letterCase: "normal",
                numbers: "normal",
                punctuation: "removed",
            }),
            true
        )
    }

    const options = [
        {
            label: "Use smaller case:",
            id: "use-smaller-case-button",
            onClick: handleUseSmallerCase,
            buttonContent: <>a-z</>,
        },
        {
            label: "Use upper case:",
            id: "use-upper-case-button",
            onClick: handleUseUpperCase,
            buttonContent: <>A-Z</>,
        },
        {
            label: "Remove numbers:",
            id: "remove-numbers-button",
            onClick: handleRemoveNumbers,
            buttonContent: (
                <>
                    <span>0-9</span>
                    <Cross1Icon className="absolute text-destructive size-7" />
                </>
            ),
        },
        {
            label: "Remove all punctuation:",
            id: "remove-punctuation-button",
            onClick: handleRemovePunctuation,
            buttonContent: (
                <>
                    <span>.,/?"':{")("}</span>
                    <Cross1Icon className="absolute text-destructive size-7" />
                </>
            ),
        },
    ]

    return (
        <FormItem>
            <FormLabel className="space-x-1">
                <span className="capitalize">
                    {field.name}
                    {changeIndicator && currentValue !== form.formState.defaultValues?.content && <span className="text-primary">*</span>}
                </span>

                <SongContentInfo />
            </FormLabel>
            <FormDescription>
                If you want to use song lyrics please ensure you have the necessary permissions to use them. This application does not
                permit unauthorized use of copyrighted materials.
                <br />
                <a href={"#"} className={"underline"}>
                    See full Terms of Use
                </a>
            </FormDescription>
            <FormControl>
                <div className="mx-1">
                    <div className="">
                        <Textarea
                            {...field}
                            placeholder={
                                "Insert the content here... \nMake sure that lines are kept together\nLike this\nTo group into" +
                                " a section\n\nAnd separate sections by\nA empty line \n..."
                            }
                            value={currentValue}
                            onChange={(e) => {
                                handleUserInput(e.target.value)
                                field.onChange(e)
                            }}
                            className="min-h-[12rem] "
                        />
                        <Collapsible>
                            <CollapsibleTrigger className="flex gap-2 items-center py-2 px-2 text-muted-foreground [&[data-state=open]>svg]:rotate-180  transition-all text-sm">
                                Text modification
                                <CaretDownIcon className="transition-transform duration-200" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="px-4 border pb-4 rounded-sm">
                                <div className="flex flex-wrap py-4">
                                    {options.map((option) => (
                                        <div className="flex gap-4 items-center border p-3 w-fit" key={option.id}>
                                            <Label htmlFor={option.id}>{option.label}</Label>
                                            <Button
                                                type="button"
                                                id="use-smaller-case-button"
                                                className="relative"
                                                variant={"outline"}
                                                size={"sm"}
                                                onClick={option.onClick}
                                            >
                                                {option.buttonContent}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-6 ">
                                    <Button
                                        type="button"
                                        variant={"secondary"}
                                        onClick={undo}
                                        disabled={history.length <= 1}
                                        className="space-x-2"
                                        size={"sm"}
                                    >
                                        <ResetIcon />
                                        <span className="text-muted-foreground text-xs">undo</span>
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={"secondary"}
                                        onClick={redo}
                                        disabled={redoHistory.length == 0}
                                        className="space-x-2"
                                        size={"sm"}
                                    >
                                        <ResetIcon className="-scale-x-100 " />
                                        <span className="text-muted-foreground text-xs">redo</span>
                                    </Button>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    </div>
                </div>
            </FormControl>
            <FormDescription className="sr-only">This is the content of the song. It is what you will be typing.</FormDescription>
            <FormMessage />
        </FormItem>
    )
}

const SongContentInfo = () => {
    return (
        <div className="inline">
            <Popover>
                <PopoverTrigger>
                    <InfoCircledIcon />
                </PopoverTrigger>
                <PopoverContent>
                    <span className="font-semibold">
                        How to format content?
                        {/*song lyrics?*/}
                    </span>
                    <div>
                        <p className="text-muted-foreground pb-5 pt-2 text-sm ">
                            Lines placed together without a empty line between them form a verse.
                        </p>

                        <div className="w-full border rounded-sm p-4  bg-background space-y-1">
                            <div className="h-1 w-[100%] bg-foreground/50 rounded-sm"></div>
                            <div className="h-1 w-[90%] bg-foreground/50 rounded-sm"></div>
                            <div className="h-1 w-[70%] bg-foreground/50 rounded-sm"></div>
                            <div className="h-1 w-[85%] bg-foreground/50 rounded-sm"></div>
                            <div className="w-full h-1"> </div>
                            <div className="h-1 w-[97%] bg-foreground/50 rounded-sm"></div>
                            <div className="h-1 w-[30%] bg-foreground/50 rounded-sm"></div>
                            <div className="h-1 w-[56%] bg-foreground/50 rounded-sm"></div>
                            <div className="h-1 w-[90%] bg-foreground/50 rounded-sm"></div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}

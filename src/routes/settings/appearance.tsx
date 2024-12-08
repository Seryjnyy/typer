import { useTheme } from "@/components/theme-provider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { TyperTextDisplay, usePreferenceStore } from "@/lib/store/preferences-store"
import { themeList } from "@/lib/themes"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"

const TyperTextDisplayOption = ({ value, onChange }: { value: TyperTextDisplay; onChange: (val: TyperTextDisplay) => void }) => {
    const options: {
        title: string
        value: TyperTextDisplay
        element: ReactNode
    }[] = [
        {
            title: "Cylinder",
            value: "cylinder",
            element: (
                <div className="w-[12rem] h-[8rem] bg-background border rounded-md flex justify-center items-center flex-col gap-1">
                    <div className="w-[52%] h-[0.15rem] bg-foreground/50 rounded-md"></div>
                    <div className="w-[60%] h-[0.15rem] bg-foreground/60 rounded-md"></div>
                    <div className="w-[66%] h-[0.20rem] bg-foreground/70 rounded-md"></div>
                    <div className="w-[68%] h-1 bg-foreground/80 rounded-md"></div>
                    <div className="w-[70%] h-1 bg-foreground/100 rounded-md my-[0.1rem]"></div>
                    <div className="w-[68%] h-1 bg-foreground/80 rounded-md"></div>
                    <div className="w-[66%] h-[0.20rem] bg-foreground/70 rounded-md"></div>
                    <div className="w-[60%] h-[0.15rem] bg-foreground/60 rounded-md"></div>
                    <div className="w-[52%] h-[0.15rem] bg-foreground/50 rounded-md"></div>
                </div>
            ),
        },
        {
            title: "Flat",
            value: "flat",
            element: (
                <div className="w-[12rem] h-[8rem] bg-background border rounded-md flex justify-center items-center flex-col gap-1">
                    <div className="w-[70%] h-1 bg-foreground rounded-md mr-auto ml-7"></div>
                    <div className="w-[50%] h-1 bg-foreground/50 rounded-md mr-auto ml-7"></div>
                    <div className="w-[40%] h-1 bg-foreground/50 rounded-md mr-auto ml-7"></div>
                    <div className="w-[68%] h-1 bg-foreground/50 rounded-md mr-auto ml-7"></div>
                    <div className="w-[40%] h-1 bg-foreground/50 rounded-md mr-auto ml-7"></div>
                    <div className="w-[59%] h-1 bg-foreground/50 rounded-md mr-auto ml-7"></div>
                    <div className="w-[60%] h-1 bg-foreground/50 rounded-md mr-auto ml-7"></div>
                    <div className="w-[70%] h-1 bg-foreground/50 rounded-md mr-auto ml-7"></div>
                    <div className="w-[70%] h-1 bg-foreground/50 rounded-md mr-auto ml-7"></div>
                </div>
            ),
        },
    ]

    return (
        <>
            {options.map((option) => (
                <div className="w-fit" key={option.title}>
                    {option.element}
                    <div className="flex justify-between px-2 pt-1">
                        <span className="text-sm font-semibold ">{option.title}</span>
                        <Checkbox
                            checked={option.value == value}
                            onCheckedChange={() => {
                                onChange(option.value)
                            }}
                        />
                    </div>
                </div>
            ))}
        </>
    )
}

export default function Appearance() {
    const { setTheme, theme } = useTheme()

    const typerTextDisplay = usePreferenceStore.use.typerTextDisplay()
    const setTyperTextDisplay = usePreferenceStore.use.setTyperTextDisplay()

    const verseTyperTextDisplay = usePreferenceStore.use.verseTyperTextDisplay()
    const setVerseTyperTextDisplay = usePreferenceStore.use.setVerseTyperTextDisplay()

    const isCompletionAnimOn = usePreferenceStore.use.isCompletionAnim()
    const setCompletionAnim = usePreferenceStore.use.setCompletionAnim()

    const isQueueColour = usePreferenceStore.use.isQueueColour()
    const setQueueColour = usePreferenceStore.use.setQueueColour()

    const isErrorAnim = usePreferenceStore.use.isErrorAnim()
    const setErrorAnim = usePreferenceStore.use.setErrorAnim()

    const setCorrectAnim = usePreferenceStore.use.setCorrectAnim()
    const isCorrectAnim = usePreferenceStore.use.isCorrectAnim()

    const setOpenEndScreenInitially = usePreferenceStore.use.setOpenEndScreenInitially()
    const isOpenEndScreenInitially = usePreferenceStore.use.isOpenEndScreenInitially()

    const setOpenEndScreenInitiallyVersePage = usePreferenceStore.use.setOpenEndScreenInitiallyVersePage()
    const isOpenEndScreenInitiallyVersePage = usePreferenceStore.use.isOpenEndScreenInitiallyVersePage()

    const options = [
        {
            id: "complete_animation_toggle",
            title: "Animation on completion",
            value: isCompletionAnimOn,
            desc: "The screen flashes upon completion of a song.",
            onCheckedChange: setCompletionAnim,
        },
        {
            id: "error_animation_toggle",
            title: "Error animation",
            value: isErrorAnim,
            desc: "There is a small flash of red to show you made an error.",
            onCheckedChange: setErrorAnim,
        },
        {
            id: "correct_animation_toggle",
            title: "Correct animation",
            value: isCorrectAnim,
            desc: "There is a small flash of green to show you typed the correct character.",
            onCheckedChange: setCorrectAnim,
        },
        {
            id: "queue_colour_toggle",
            title: "Queue colour",
            value: isQueueColour,
            desc: "The queue gets a background gradient based on the song cover.",
            onCheckedChange: setQueueColour,
        },

        {
            id: "open_end_screen_auto_toggle",
            title: "Open End screen automatically",
            value: isOpenEndScreenInitially,
            desc: "Chose if you want the end screen to open when you complete the song.",
            onCheckedChange: setOpenEndScreenInitially,
        },
        {
            id: "open_end_screen_verse_page_auto_toggle",
            title: "Open End screen automatically in Verse page",
            value: isOpenEndScreenInitiallyVersePage,
            desc: "Chose if you want the end screen to open when you complete the verse. ",
            onCheckedChange: setOpenEndScreenInitiallyVersePage,
        },
    ]

    return (
        <div className="space-y-12">
            <div>
                <h2 className="text-2xl font-semibold pb-2">Theme</h2>
                <Card>
                    <CardHeader>
                        <CardTitle>Theme</CardTitle>
                        <CardDescription>Select the theme you want.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex w-full flex-wrap gap-2 px-6">
                            {themeList
                                .sort((x) => (x.split("-")[0] == "light" ? -1 : 1))
                                .map((themeName) => {
                                    if (themeName == "root") return null
                                    return (
                                        <div key={themeName} className={cn("p-4  w-fit rounded-sm", themeName)}>
                                            <div className="w-[12rem] h-[8rem] bg-background border rounded-md flex flex-col justify-between">
                                                <div className="flex justify-between h-full">
                                                    <div className="w-full pl-6 pt-4 space-y-3">
                                                        <div className="space-y-1">
                                                            <div className="w-[70%] h-1 bg-foreground rounded-md"></div>
                                                            <div className="w-[50%] h-1 bg-foreground rounded-md"></div>
                                                            <div className="w-[65%] h-1 bg-foreground rounded-md"></div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="w-[55%] h-1 bg-foreground rounded-md"></div>
                                                            <div className="w-[70%] h-1 bg-foreground rounded-md"></div>
                                                            <div className="w-[65%] h-1 bg-foreground rounded-md"></div>
                                                        </div>
                                                    </div>
                                                    <div className="w-11 border-l h-full space-y-1 px-1">
                                                        <div className="h-5 w-full border rounded-[3px] pt-1 pl-1 space-y-1 mt-3">
                                                            <div className="h-1 w-[80%]  bg-secondary-foreground rounded-sm"></div>
                                                            <div className="h-1 w-[40%] bg-muted-foreground rounded-sm"></div>
                                                        </div>
                                                        <div className="h-5 w-full bg-secondary rounded-[3px] pt-1 pl-1 space-y-1">
                                                            <div className="h-1 w-[80%]  bg-secondary-foreground rounded-sm"></div>
                                                            <div className="h-1 w-[40%] bg-muted-foreground rounded-sm"></div>
                                                        </div>
                                                        <div className="h-5 w-full border rounded-[3px] pt-1 pl-1 space-y-1">
                                                            <div className="h-1 w-[80%]  bg-secondary-foreground rounded-sm"></div>
                                                            <div className="h-1 w-[40%] bg-muted-foreground rounded-sm"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="border-t flex justify-center py-1">
                                                    <div className="bg-primary rounded-full h-3 w-3"></div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between pt-1 px-2">
                                                <span className="text-muted-foreground">{themeName}</span>
                                                <Checkbox
                                                    checked={themeName == theme}
                                                    onCheckedChange={(val) => {
                                                        if (val == "indeterminate") return

                                                        if (val) setTheme(themeName)
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                        </div>
                    </CardContent>
                    <CardFooter></CardFooter>
                </Card>
            </div>
            <div>
                <h2 className="text-2xl font-semibold pb-2">Text display</h2>
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Typer text</CardTitle>
                            <CardDescription>Change the way text in typer is displayed.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-3 flex-wrap">
                                <TyperTextDisplayOption value={typerTextDisplay} onChange={setTyperTextDisplay} />
                            </div>
                        </CardContent>

                        <CardFooter></CardFooter>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Verse typer text</CardTitle>
                            <CardDescription>Change the way text in verse typer is displayed.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-3 flex-wrap">
                                <TyperTextDisplayOption value={verseTyperTextDisplay} onChange={setVerseTyperTextDisplay} />
                            </div>
                        </CardContent>

                        <CardFooter></CardFooter>
                    </Card>
                </div>
            </div>
            <div>
                <h2 className="text-2xl font-semibold pb-2">Other</h2>
                <Card>
                    <CardHeader>
                        <CardTitle>Other</CardTitle>
                        <CardDescription>Change the various other options.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {options.map((option) => (
                            <div className="border rounded-md p-2 flex justify-between" key={option.id}>
                                <div className="flex flex-col" key={option.id}>
                                    <span className="text-lg font-semibold">{option.title}</span>
                                    <p className="text-muted-foreground text-sm md:pr-12 pl-2">{option.desc}</p>
                                </div>
                                <div className="flex justify-center items-center px-4 border-l ">
                                    <Checkbox
                                        checked={option.value}
                                        onCheckedChange={(val) => {
                                            if (val == "indeterminate") return
                                            option.onCheckedChange(val)
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>

                    <CardFooter></CardFooter>
                </Card>
            </div>
        </div>
    )
}

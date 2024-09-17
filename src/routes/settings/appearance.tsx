import { useTheme } from "@/components/theme-provider";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    TyperTextDisplay,
    usePreferenceStore,
} from "@/lib/store/preferences-store";
import { themeList } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const TyperTextDisplayOption = () => {
    const typerTextDisplay = usePreferenceStore.use.typerTextDisplay();
    const setTyperTextDisplay = usePreferenceStore.use.setTyperTextDisplay();

    const options: {
        title: string;
        value: TyperTextDisplay;
        element: ReactNode;
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
    ];

    return (
        <>
            {options.map((option) => (
                <div className="w-fit" key={option.title}>
                    {option.element}
                    <div className="flex justify-between px-2 pt-1">
                        <span className="text-sm font-semibold ">
                            {option.title}
                        </span>
                        <Checkbox
                            checked={option.value == typerTextDisplay}
                            onCheckedChange={(val) => {
                                setTyperTextDisplay(option.value);
                            }}
                        />
                    </div>
                </div>
            ))}
        </>
    );
};

export default function Appearance() {
    const { setTheme, theme } = useTheme();

    return (
        <div className="space-y-12">
            <div>
                <h2 className="text-2xl font-semibold pb-2">Theme</h2>
                <Card>
                    <CardHeader>
                        <CardTitle>Theme</CardTitle>
                        <CardDescription>
                            Select the theme you want.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex w-full flex-wrap gap-2 px-6">
                            {themeList
                                .sort((x) =>
                                    x.split("-")[0] == "light" ? -1 : 1
                                )
                                .map((themeName, i) => {
                                    if (themeName == "root") return null;
                                    return (
                                        <div
                                            key={themeName}
                                            className={cn(
                                                "p-4  w-fit rounded-sm",
                                                themeName
                                            )}
                                        >
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
                                                <span className="text-muted-foreground">
                                                    {themeName}
                                                </span>
                                                <Checkbox
                                                    checked={themeName == theme}
                                                    onCheckedChange={(val) => {
                                                        if (
                                                            val ==
                                                            "indeterminate"
                                                        )
                                                            return;

                                                        if (val)
                                                            setTheme(themeName);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </CardContent>
                    <CardFooter></CardFooter>
                </Card>
            </div>
            <div>
                <h2 className="text-2xl font-semibold pb-2">Text display</h2>
                <Card>
                    <CardHeader>
                        <CardTitle>Typer text</CardTitle>
                        <CardDescription>
                            Change the way text in typer is displayed.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-3 flex-wrap">
                            <TyperTextDisplayOption />
                        </div>
                    </CardContent>

                    <CardFooter></CardFooter>
                </Card>
            </div>
        </div>
    );
}

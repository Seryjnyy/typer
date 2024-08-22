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
import { themeList } from "@/lib/themes";
import { cn } from "@/lib/utils";

// TODO : Why did i do this ???? just add the class name to className
export default function Appearance() {
    const { setTheme, theme } = useTheme();
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Theme</CardTitle>
                    <CardDescription>
                        Select the theme you want.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div>
                        {/* <h3 className="text-sm font-semibold">Light</h3> */}
                    </div>
                </CardContent>
                <div className="flex w-full flex-wrap gap-2 px-6">
                    {themeList
                        .sort((x) => (x.split("-")[0] == "light" ? -1 : 1))
                        .map((themeName) => {
                            if (themeName == "root") return <></>;
                            return (
                                <div
                                    key={themeName}
                                    className={cn(
                                        "p-4 border w-fit rounded-sm",
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
                                    <div className="flex items-center justify-between pt-2">
                                        <span className="text-muted-foreground">
                                            {themeName}
                                        </span>
                                        <Checkbox
                                            checked={themeName == theme}
                                            onCheckedChange={(val) => {
                                                if (val == "indeterminate")
                                                    return;

                                                if (val) setTheme(themeName);
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                </div>
                <CardFooter></CardFooter>
            </Card>
        </div>
    );
}

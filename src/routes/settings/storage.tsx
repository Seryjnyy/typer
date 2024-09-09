import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { useSongStore } from "@/lib/store/song-store";
import { formatBytes } from "@/lib/utils";
import { LabelList, Pie, PieChart } from "recharts";

var localStorageSpace = function () {
    var allStrings = "";
    for (var key in window.localStorage) {
        if (window.localStorage.hasOwnProperty(key)) {
            allStrings += window.localStorage[key];
        }
    }
    return allStrings ? 3 + allStrings.length * 16 : 0;
};

export const seeSizeOfStringInLocalStorage = (some: string) => {
    return some ? 3 + (some.length * 16) / (8 * 1024) + " KB" : "Empty (0 KB)";
};

export default function Storage() {
    const localStorageUse = localStorageSpace();
    console.log(localStorageSpace());
    const setSongs = useSongStore.use.setSongs();

    const chartData = [
        {
            state: "used",
            bytes: localStorageUse,
            fill: "var(--color-used)",
        },
        {
            state: "available",
            bytes: 10000000 - localStorageUse,
            fill: "var(--color-available)",
        },
    ];

    const chartConfig = {
        bytes: {
            label: "Bytes",
        },
        used: {
            label: "Used",
            color: "hsl(var(--chart-3))",
        },
        available: {
            label: "Available",
            color: "hsl(var(--chart-2))",
        },
    } satisfies ChartConfig;

    // TODO : Should have confirm dialog
    // TODO : Should have snackbar
    const onClearSongs = () => {
        setSongs([]);
    };

    return (
        <div className="space-y-12">
            <div>
                <h2 className="text-2xl font-semibold pb-2">Song storage</h2>
                <Card>
                    <CardHeader>
                        <CardTitle>LocalStorage</CardTitle>
                        <CardDescription>
                            The primary store used for all user data.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <ChartContainer
                                config={chartConfig}
                                className="mx-auto aspect-square max-h-[250px]"
                            >
                                <PieChart>
                                    <ChartTooltip
                                        content={
                                            <ChartTooltipContent
                                                nameKey="bytes"
                                                hideLabel
                                            />
                                        }
                                    />
                                    <Pie
                                        data={chartData}
                                        dataKey="bytes"
                                        isAnimationActive={false}
                                    >
                                        <LabelList
                                            dataKey="state"
                                            className="fill-background"
                                            stroke="none"
                                            fontSize={12}
                                            formatter={(
                                                value: keyof typeof chartConfig
                                            ) => chartConfig[value]?.label}
                                        />
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                        </div>
                        <div>
                            <span className="text-sm text-muted-foreground">{`${formatBytes(
                                localStorageUse,
                                4
                            )} / ${formatBytes(10000000, 4)}`}</span>
                        </div>
                    </CardContent>

                    <CardFooter className="border-t px-6 py-4">
                        <span className="text-xs text-muted-foreground">
                            Strings in JavaScript are UTF-16, so each character
                            requires two bytes of memory. This means that while
                            many browsers have a 5 MB limit, you can only store
                            2.5 M characters.
                        </span>
                    </CardFooter>
                </Card>
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold pb-2">Queue</h2>
                <Card>
                    <CardHeader>
                        <CardTitle>Queue stuff</CardTitle>
                        <CardDescription>Some queue stuff.</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        {/* <Button variant={"destructive"}>Clear</Button> */}
                    </CardFooter>
                </Card>
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold pb-2">Danger zone</h2>
                <Card className="flex justify-between items-center border border-destructive">
                    <CardHeader>
                        <CardTitle>Clear songs</CardTitle>
                        <CardDescription>
                            This will remove ALL songs in localStorage.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="p-0 pr-4">
                        <Button variant={"destructive"} onClick={onClearSongs}>
                            Clear
                        </Button>
                    </CardFooter>
                </Card>
                <Card className="flex justify-between items-center border border-destructive">
                    <CardHeader>
                        <CardTitle>Clear localStorage</CardTitle>
                        <CardDescription>
                            This will remove ALL data in localStorage stored by
                            this app. Including songs, queue and preferences.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="p-0 pr-4">
                        <Button variant={"destructive"}>Clear</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

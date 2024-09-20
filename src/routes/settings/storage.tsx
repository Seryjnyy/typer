import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import {
    QueueStorage as QueueStorageType,
    usePreferenceStore,
} from "@/lib/store/preferences-store";
import { useSongStore } from "@/lib/store/song-store";
import { formatBytes } from "@/lib/utils";
import { LabelList, Pie, PieChart } from "recharts";

const localStorageSpace = () => {
    var allStrings = "";
    for (var key in window.localStorage) {
        if (window.localStorage.hasOwnProperty(key)) {
            allStrings += window.localStorage[key];
        }
    }
    return allStrings ? 3 + allStrings.length * 16 : 0;
};

const QueueStorage = () => {
    const queueStoragePreference = usePreferenceStore.use.queueStorage();
    const setQueueStoragePreference = usePreferenceStore.use.setQueueStorage();

    const options: {
        id: string;
        title: string;
        desc: string;
        value: QueueStorageType;
    }[] = [
        {
            id: "localStorage",
            title: "localStorage",
            value: "localStorage",
            desc: "Items in the queue will persist even after closing the window. The queue will be the same across all instances of the app.",
        },
        {
            id: "sessionStorage",
            title: "sessionStorage",
            value: "sessionStorage",
            desc: "Items in the queue will persist only as long as the window is open. The queue will also be unique to each instance of the app.",
        },
    ];

    return (
        <div className="space-y-2">
            <h2 className="text-2xl font-semibold pb-2">Queue</h2>
            <Card>
                <CardHeader>
                    <CardTitle>Queue storage</CardTitle>
                    <CardDescription>How the queue is stored.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {options.map((option) => (
                            <div
                                className="border rounded-md p-2 flex justify-between"
                                key={option.id}
                            >
                                <div className="flex flex-col" key={option.id}>
                                    <span className="text-lg font-semibold">
                                        {option.title}
                                    </span>
                                    <p className="text-muted-foreground text-sm md:pr-12 pl-2">
                                        {option.desc}
                                    </p>
                                </div>
                                <div className="flex justify-center items-center px-4 border-l ">
                                    <Checkbox
                                        checked={
                                            queueStoragePreference ==
                                            option.value
                                        }
                                        onCheckedChange={() => {
                                            setQueueStoragePreference(
                                                option.value
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                    <p className="text-xs text-muted-foreground">
                        This will require a page refresh to take effect.
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
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

    const onClearSongs = () => {
        setSongs([]);

        toast({
            title: "Cleared songs.",
            description: `Successfully cleared all stored songs.`,
        });
    };

    const onClearLocalStorage = () => {
        localStorage.clear();

        toast({
            title: "Cleared localStorage.",
            description: `Successfully removed everything the app stored in localStorage.`,
        });
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
            <QueueStorage />
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
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant={"destructive"}>Clear</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete your stored songs.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction onClick={onClearSongs}>
                                        Continue
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
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
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant={"destructive"}>Clear</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will
                                        permanently remove everything stored by
                                        this app in localStorage.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={onClearLocalStorage}
                                    >
                                        Continue
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

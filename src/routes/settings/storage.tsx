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
import { formatBytes } from "@/lib/utils";
import { LabelList, Pie, PieChart } from "recharts";

export default function Storage() {
    const localStorageUse = JSON.stringify(localStorage).length * 80;

    const chartData = [
        {
            state: "used",
            bytes: localStorageUse,
            fill: "var(--color-used)",
        },
        {
            state: "available",
            bytes: 2636625 - localStorageUse,
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

    return (
        <div>
            <Card x-chunk="dashboard-04-chunk-1">
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
                                <Pie data={chartData} dataKey="bytes">
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
                            localStorageUse
                        )} / ${formatBytes(2636625, 4)}`}</span>
                    </div>
                </CardContent>

                <CardFooter className="border-t px-6 py-4">
                    <span className="text-xs text-muted-foreground">
                        Strings in JavaScript are UTF-16, so each character
                        requires two bytes of memory. This means that while many
                        browsers have a 5 MB limit, you can only store 2.5 M
                        characters.
                    </span>
                </CardFooter>
            </Card>
            <div>
                chart - show split, songs/completion/playlists/preferences
            </div>
            <div>completion - reset, delete data</div>
            <div>completion - turn off, do not delete</div>
            <div>completion - reset, delete data</div>
            <div>stats - reset, delete data, etc.</div>
            <div>playlist - delete data</div>
        </div>
    );
}

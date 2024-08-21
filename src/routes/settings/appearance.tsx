import { ModeToggle } from "@/components/mode-toggle";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { themes } from "@/lib/themes";
import React from "react";

export default function Appearance() {
    const { setTheme } = useTheme();
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
                        <h3 className="text-sm font-semibold">Light</h3>
                    </div>
                </CardContent>
                {themes.map((x) => {
                    return (
                        <Button onClick={() => setTheme(x.name)} key={x.name}>
                            set {x.name}
                        </Button>
                    );
                })}
                <CardFooter className="border-t px-6 py-4">
                    <Button>Save</Button>
                </CardFooter>
            </Card>
            <ModeToggle />
        </div>
    );
}

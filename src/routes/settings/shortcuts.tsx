import { useShortcutsStore } from "@/lib/store/shortcuts-store.ts"
import { useMemo } from "react"
import { Button } from "@/components/ui/button.tsx"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Checkbox } from "@/components/ui/checkbox.tsx"
import ShortcutKeys from "@/components/shortcut-keys.tsx"

function Shortcuts() {
    const shortcuts = useShortcutsStore.use.shortcuts()
    const reset = useShortcutsStore.use.reset()
    const toggleShortcut = useShortcutsStore.use.toggleShortcut()

    // The sorting is a temporary solution until toggleShortcut logic is not changed
    // It currently removes the shortcut then adds it at the end when inserting, so each time a shortcut is toggled it messes up the order
    // Just sort it by id for now
    const typerShortcuts = useMemo(() => shortcuts.filter((x) => x.type === "typer").sort((a, b) => a.id.localeCompare(b.id)), [shortcuts])
    const spotifyShortcuts = useMemo(
        () => shortcuts.filter((x) => x.type === "spotify-player").sort((a, b) => a.id.localeCompare(b.id)),
        [shortcuts]
    )

    return (
        <div className="space-y-12">
            <h2 className="text-2xl font-semibold pb-2">Shortcuts</h2>
            <div className={"space-y-4"}>
                <Card>
                    <CardHeader>
                        <CardTitle>Typer shortcuts</CardTitle>
                        <CardDescription>Enable or disable typer shortcuts.</CardDescription>
                    </CardHeader>
                    <CardContent className={"flex flex-col gap-3"}>
                        {typerShortcuts.map((x) => (
                            <div className="border rounded-md p-2 flex justify-between" key={x.id}>
                                <div className="flex flex-col" key={x.id}>
                                    <span className="text-lg font-semibold">{x.label}</span>
                                    <p className="text-muted-foreground text-sm md:pr-12 pl-2">{x.desc}</p>
                                </div>
                                <div className={"flex items-center"}>
                                    <div className={"px-4 border-l text-sm text-muted-foreground"}>
                                        <ShortcutKeys shortcut={x} />
                                    </div>
                                    <div className="flex justify-center items-center px-4 border-l ">
                                        <Checkbox
                                            checked={x.enabled}
                                            onCheckedChange={(val) => {
                                                if (val == "indeterminate") return
                                                toggleShortcut(x.id, val)
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter></CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Spotify shortcuts</CardTitle>
                        <CardDescription>Enable or disable spotify shortcuts.</CardDescription>
                    </CardHeader>
                    <CardContent className={"flex flex-col gap-3"}>
                        {spotifyShortcuts.map((x) => (
                            <div className="border rounded-md p-2 flex justify-between" key={x.id}>
                                <div className="flex flex-col" key={x.id}>
                                    <span className="text-lg font-semibold">{x.label}</span>
                                    <p className="text-muted-foreground text-sm md:pr-12 pl-2">{x.desc}</p>
                                </div>
                                <div className={"flex items-center"}>
                                    <div className={"px-4 border-l text-sm text-muted-foreground"}>
                                        <ShortcutKeys shortcut={x} />
                                    </div>
                                    <div className="flex justify-center items-center px-4 border-l ">
                                        <Checkbox
                                            checked={x.enabled}
                                            onCheckedChange={(val) => {
                                                if (val == "indeterminate") return
                                                toggleShortcut(x.id, val)
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter></CardFooter>
                </Card>

                <Card className="flex justify-between items-center border border-destructive">
                    <CardHeader>
                        <CardTitle>Reset shortcuts</CardTitle>
                        <CardDescription>This will reset all shortcuts to their default values.</CardDescription>
                    </CardHeader>
                    <CardFooter className="p-0 pr-4">
                        <Button variant={"destructive"} onClick={() => reset()}>
                            Reset
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default Shortcuts

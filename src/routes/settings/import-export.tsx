import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { usePreferenceStore } from "@/lib/store/preferences-store"
import { Button } from "@/components/ui/button"
import DropZone from "@/components/drop-zone"
import { useSongStore } from "@/lib/store/song-store"
import useExportSongs from "@/lib/hooks/use-export-song"
import { PlusIcon } from "@radix-ui/react-icons"

const songMandatoryExports = {
    title: true,
    source: true,
    content: true,
}

const songMandatoryImports = {
    title: true,
    source: true,
    content: true,
}

const Export = () => {
    const songsList = useSongStore.use.songs()
    const { exportSongs, exported, clear } = useExportSongs()

    const handleExportAllSongs = () => {
        exportSongs(songsList)
    }

    const handleTryAgain = () => {
        clear()
    }

    if (exported != 0) {
        return (
            <div className="w-full flex flex-col justify-center items-center gap-12 border p-2 rounded-sm">
                <div className="flex flex-col items-center justify-center">
                    <span className="text-lg">Successfully exported your songs.</span>
                    <span className="text-muted-foreground">Exported ({exported}) songs.</span>
                </div>
                <div className="flex gap-3">
                    <Button className="space-x-2" onClick={handleTryAgain}>
                        <PlusIcon /> <span>Export more</span>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex justify-evenly gap-4 flex-wrap border rounded-sm p-4">
            <Button onClick={handleExportAllSongs}>Export all songs</Button>

            <Button disabled>Select songs to export</Button>
        </div>
    )
}

export default function ImportExport() {
    const songExportPreferences = usePreferenceStore.use.exportSongs()
    const setExportSongPreferences = usePreferenceStore.use.setExportSongs()

    const songImportPreferences = usePreferenceStore.use.importSongs()
    const setImportSongsPreferences = usePreferenceStore.use.setImportSongs()

    const resetExportPref = usePreferenceStore.use.resetExportPref()
    const resetImportPref = usePreferenceStore.use.resetImportPref()

    const handleChangeSongExportPreferences = (option: string, val: boolean) => {
        console.log(option)
        switch (option) {
            case "cover":
                setExportSongPreferences({
                    ...songExportPreferences,
                    cover: val,
                })
                break
            case "completion":
                setExportSongPreferences({
                    ...songExportPreferences,
                    completion: val,
                })
                break
            case "record":
                setExportSongPreferences({
                    ...songExportPreferences,
                    record: val,
                })
                break
            case "createdAt":
                setExportSongPreferences({
                    ...songExportPreferences,
                    createdAt: val,
                })
                break
        }
    }

    const handleChangeSongImportPreferences = (option: string, val: boolean) => {
        console.log(option)
        switch (option) {
            case "cover":
                setImportSongsPreferences({
                    ...songImportPreferences,
                    cover: val,
                })
                break
            case "completion":
                setImportSongsPreferences({
                    ...songImportPreferences,
                    completion: val,
                })
                break
            case "record":
                setImportSongsPreferences({
                    ...songImportPreferences,
                    record: val,
                })
                break
            case "createdAt":
                setImportSongsPreferences({
                    ...songImportPreferences,
                    createdAt: val,
                })
                break
        }
    }

    const handleResetImportExportPref = () => {
        resetExportPref()
        resetImportPref()
    }

    return (
        <div className="space-y-12">
            <div>
                <h2 className="text-2xl font-semibold pb-2">Export songs</h2>
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Export songs</CardTitle>
                            <CardDescription>Select what songs to export</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Export />
                        </CardContent>

                        <CardFooter></CardFooter>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Chose exported values</CardTitle>
                            <CardDescription>Select what values from song to export.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-col gap-2 py-1">
                                    <span className="text-muted-foreground text-sm">Mandatory</span>
                                    {Object.entries(songMandatoryExports).map((x) => (
                                        <div className="flex gap-2" key={x[0]}>
                                            <Checkbox disabled checked={x[1]} />
                                            <Label htmlFor={x[0]} className="capitalize">
                                                {x[0]}
                                            </Label>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <span className="text-muted-foreground text-sm">Optional</span>
                                    {Object.entries(songExportPreferences).map((x) => (
                                        <div className="flex gap-2" key={x[0]}>
                                            <Checkbox
                                                checked={x[1]}
                                                onCheckedChange={(val) => {
                                                    if (val == "indeterminate") return
                                                    handleChangeSongExportPreferences(x[0], val)
                                                }}
                                            />
                                            <Label htmlFor={x[0]} className="capitalize">
                                                {x[0]}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="border-t px-6 py-4">
                            <span className="text-xs text-muted-foreground">
                                Everything optional will be generated automatically on import.
                            </span>
                        </CardFooter>
                    </Card>
                </div>
            </div>
            <div>
                <h2 className="text-2xl font-semibold pb-2">Import songs</h2>
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Import songs</CardTitle>
                            <CardDescription>Chose a JSON file to import.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DropZone />
                        </CardContent>

                        <CardFooter></CardFooter>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Chose imported values</CardTitle>
                            <CardDescription>Select what values from song to import.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-col gap-2 py-1">
                                    <span className="text-muted-foreground text-sm">Mandatory</span>
                                    {Object.entries(songMandatoryImports).map((x) => (
                                        <div className="flex gap-2" key={x[0]}>
                                            <Checkbox disabled checked={x[1]} />
                                            <Label htmlFor={x[0]} className="capitalize">
                                                {x[0]}
                                            </Label>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <span className="text-muted-foreground text-sm">Optional</span>
                                    {Object.entries(songImportPreferences).map((x) => (
                                        <div className="flex gap-2" key={x[0]}>
                                            <Checkbox
                                                checked={x[1]}
                                                onCheckedChange={(val) => {
                                                    if (val == "indeterminate") return
                                                    handleChangeSongImportPreferences(x[0], val)
                                                }}
                                            />
                                            <Label htmlFor={x[0]} className="capitalize">
                                                {x[0]}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="border-t px-6 py-4">
                            <span className="text-xs text-muted-foreground">
                                Everything unselected will be generated automatically on import.
                            </span>
                        </CardFooter>
                    </Card>
                </div>
            </div>
            <Card className="flex justify-between items-center border border-destructive">
                <CardHeader>
                    <CardTitle>Reset import/export preferences</CardTitle>
                    <CardDescription>This will reset all your import/export preferences to the defaults.</CardDescription>
                </CardHeader>
                <CardFooter className="p-0 pr-4">
                    <Button variant={"destructive"} onClick={handleResetImportExportPref}>
                        Reset
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

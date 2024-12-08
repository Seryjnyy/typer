import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { usePreferenceStore } from "@/lib/store/preferences-store"

export default function Preferences() {
    const pref = usePreferenceStore()

    const preferences = Object.entries(pref).filter(([, val]) => typeof val != "function")

    return (
        <div className="space-y-12">
            <div>
                <h2 className="text-2xl font-semibold pb-2">Preferences</h2>
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>List of all preferences</CardTitle>
                            <CardDescription>View your preferences. These can be changed in other parts of settings.</CardDescription>
                        </CardHeader>
                        <CardContent className="backdrop-brightness-50 m-2 pt-4 rounded-md space-y-2 text-xs md:text-sm">
                            <pre>
                                <code>
                                    {preferences.map((preference, index) => (
                                        <span className="block" key={index}>
                                            <span className="text-primary opacity-50">{preference[0]}</span> -{" "}
                                            {
                                                <span className="text-wrap ">
                                                    {JSON.stringify(preference[1]).replace(/,/g, "\n\t").replace("{", "\n\t{")}
                                                </span>
                                            }
                                        </span>
                                    ))}
                                </code>
                            </pre>
                        </CardContent>
                        <CardFooter></CardFooter>
                    </Card>
                    <Card className="flex justify-between items-center border border-destructive">
                        <CardHeader>
                            <CardTitle>Reset preferences</CardTitle>
                            <CardDescription>This will reset all your preferences to the defaults.</CardDescription>
                        </CardHeader>
                        <CardFooter className="p-0 pr-4">
                            <Button variant={"destructive"} onClick={pref.resetPreferences}>
                                Reset
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}

import { Device as DeviceType } from "@spotify/web-api-ts-sdk"
import { useEffect, useMemo, useState } from "react"
import { useAvailableDevices } from "../spotify-api"
import { useSpotify } from "../use-spotify"
import { Computer, Keyboard, Loader2, MonitorSmartphone, Smartphone, Speaker } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

// TODO : still not the best, some could still not know when its connected or not, or how to fix that its not connected
// TODO : When device is changed, it changes the device properly, but doesn't not update the UI Here
// TODO : Could do with a tooltip
// TODO : unhandeled error
const MyDevices = () => {
    const [open, setOpen] = useState(false)
    const {
        data,
        isLoading,
        // isError,
        refetch,
    } = useAvailableDevices()

    const onChangeDevice = () => {
        refetch()
    }

    const activeDevice = useMemo(() => data?.devices.find((device) => device.is_active), [data?.devices])
    const isTyperActive = useMemo(() => activeDevice?.name.includes("typer") ?? false, [activeDevice?.name])

    useEffect(() => {
        if (open) {
            refetch()
        }
    }, [open, refetch])

    console.log("rerenders")

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant={"ghost"} size={"icon"}>
                    <MonitorSmartphone className={cn(isTyperActive ? "text-green-600" : "text-red-600")} />
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <div>
                    <h2 className="font-semibold">Available devices</h2>
                    <ul className="space-y-2 pt-2">
                        {isLoading && (
                            <li className="flex justify-center">
                                <Loader2 className="animate-spin" />
                            </li>
                        )}
                        {data?.devices.map((device) => (
                            <li key={device.id}>
                                <Device device={device} onChangeDevice={onChangeDevice} />
                            </li>
                        ))}
                    </ul>
                </div>
            </PopoverContent>
        </Popover>
    )
}

const Device = ({ device, onChangeDevice }: { device: DeviceType; onChangeDevice?: () => void }) => {
    const { apiSDK } = useSpotify({})
    const [isPending, setIsPending] = useState(false)

    const handleClick = async () => {
        if (!device.id || device.is_active || !apiSDK) return
        setIsPending(true)
        await apiSDK.player.transferPlayback([device.id], true)
        setIsPending(false)
        onChangeDevice?.()
    }

    const isActive = device.is_active

    // TODO : name should come from config
    const isThisApp = device.name.includes("typer")

    const deviceType = isThisApp ? "Typer" : device.type
    return (
        <div
            className={cn("border p-2 cursor-pointer flex gap-2 hover:bg-secondary rounded-md  items-center", isActive && "text-green-500")}
            onClick={handleClick}
        >
            {isPending && "loading"}
            {deviceType == "Typer" && <Keyboard size={24} />}
            {deviceType == "Speaker" && <Speaker size={24} />}
            {deviceType == "Smartphone" && <Smartphone size={24} />}
            {deviceType == "Computer" && <Computer size={24} />}
            <span>{device.name}</span>
            {deviceType == "Typer" && <span className="text-[0.6rem] text-muted-foreground">(This app)</span>}
        </div>
    )
}

export default MyDevices

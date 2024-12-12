import { Device as DeviceType } from "@spotify/web-api-ts-sdk"
import { useEffect, useMemo, useState } from "react"

import { Computer, Keyboard, Loader2, MonitorSmartphone, Smartphone, Speaker } from "lucide-react"
import { cn } from "@/lib/utils.ts"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx"
import { Button } from "@/components/ui/button.tsx"
import { useSpotifyWebSDKContext } from "@/components/spotify-new/providers/spotify-web-sdk-provider.tsx"
import { useAvailableDevices } from "@/components/spotify-new/spotify-api.ts"

// TODO : There is still an issue with this not showing that typer is currently connected at the start unless this is opened
//  Not sure if it should stay like this where the current device is not really important, or should it hide everything
//  unless typer is the current device and force the user to transfer playback to typer. Would also need to stop playback then from
//  doing things.
//  Currently the user can change typer song and usePlayback will make the request to play the track on this device which will
//  automatically transfer playback here.
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
    const webSDK = useSpotifyWebSDKContext()
    const [isPending, setIsPending] = useState(false)

    const handleClick = async () => {
        if (!device.id || device.is_active || !webSDK) return
        setIsPending(true)
        await webSDK.player.transferPlayback([device.id], true)
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

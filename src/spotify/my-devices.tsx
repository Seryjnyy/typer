import { Device as DeviceType } from "@spotify/web-api-ts-sdk";
import { useCallback, useState } from "react";
import { useAvailableDevices } from "./spotify-api";
import { useSpotify } from "./use-spotify";
import { Computer, Keyboard, Laptop, Smartphone, Speaker } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const MyDevices = () => {
    const { data, isLoading, isError, refetch } = useAvailableDevices();
    const onChangeDevice = useCallback(() => {
        refetch();
    }, [refetch]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={"ghost"} size={"icon"}>
                    <Laptop />
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <div>
                    <h2>Available devices</h2>
                    <ul className="space-y-2 pt-2">
                        {data?.devices.map((device) => (
                            <li key={device.id}>
                                <Device
                                    device={device}
                                    onChangeDevice={onChangeDevice}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </PopoverContent>
        </Popover>
    );
};

const Device = ({
    device,
    onChangeDevice,
}: {
    device: DeviceType;
    onChangeDevice?: () => void;
}) => {
    const { apiSDK } = useSpotify({});
    const [isPending, setIsPending] = useState(false);

    const handleClick = async () => {
        if (!device.id || device.is_active || !apiSDK) return;
        setIsPending(true);
        await apiSDK.player.transferPlayback([device.id], true);
        setIsPending(false);
        onChangeDevice?.();
    };

    const isActive = device.is_active;

    // TODO : name should come from config
    const isThisApp = device.name.includes("typer");

    const deviceType = isThisApp ? "Typer" : device.type;
    return (
        <div
            className={cn(
                "border p-2 cursor-pointer flex gap-2 hover:bg-secondary rounded-md",
                isActive && "text-green-500"
            )}
            onClick={handleClick}
        >
            {isPending && "loading"}
            {deviceType == "Typer" && <Keyboard size={24} />}
            {deviceType == "Speaker" && <Speaker size={24} />}
            {deviceType == "Smartphone" && <Smartphone size={24} />}
            {deviceType == "Computer" && <Computer size={24} />}
            <span>{device.name}</span>
        </div>
    );
};

export default MyDevices;

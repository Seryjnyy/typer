import { FileTextIcon, GearIcon, KeyboardIcon } from "@radix-ui/react-icons";
import { ReactNode } from "react";

import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const windowControlVariants = cva(
    "border flex justify-evenly flex-1 h-full  overflow-hidden",
    {
        variants: {
            variant: {
                default: "rounded-sm",
                square: "rounded-none",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

interface WindowControlsProps
    extends VariantProps<typeof windowControlVariants> {}

export default function WindowControls({ variant }: WindowControlsProps) {
    const location = useLocation();
    const locationSplit = location.pathname.split("/");
    const currentLocation = locationSplit.length > 0 ? locationSplit[1] : "";

    const options: { link: string[]; label: string; icon: ReactNode }[] = [
        { link: ["", "verse"], label: "Typer", icon: <KeyboardIcon /> },
        { link: ["songs"], label: "Songs", icon: <FileTextIcon /> },
        { link: ["settings"], label: "Settings", icon: <GearIcon /> },
    ];

    return (
        <div className={windowControlVariants({ variant })}>
            <TooltipProvider>
                {options.map((option) => {
                    return (
                        <Tooltip key={option.link[0]}>
                            <TooltipTrigger asChild>
                                <Link
                                    to={option.link[0]}
                                    className="w-full h-full"
                                >
                                    <Button
                                        size={"icon"}
                                        variant={
                                            option.link.includes(
                                                currentLocation
                                            )
                                                ? "default"
                                                : "ghost"
                                        }
                                        className={cn(
                                            "rounded-none w-full h-full"
                                        )}
                                    >
                                        {option.icon}
                                    </Button>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{option.label}</p>
                            </TooltipContent>
                        </Tooltip>
                    );
                })}
            </TooltipProvider>
        </div>
    );
}

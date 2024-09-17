import { FileTextIcon, GearIcon, KeyboardIcon } from "@radix-ui/react-icons";
import { ReactNode } from "react";

import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const windowControlVariants = cva("border flex justify-evenly flex-1 h-full", {
    variants: {
        variant: {
            default: "rounded-md",
            square: "rounded-none",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

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
            {options.map((option, index) => {
                let className = "";
                if (index == 0) {
                    className = "rounded-l-md ";
                }
                if (index == options.length - 1) {
                    className = "rounded-r-md ";
                }

                return (
                    <Link
                        to={option.link[0]}
                        key={option.link[0]}
                        className="w-full h-full"
                    >
                        <Button
                            size={"icon"}
                            variant={
                                option.link.includes(currentLocation)
                                    ? "default"
                                    : "ghost"
                            }
                            className={cn(
                                "rounded-none w-full h-full",
                                className
                            )}
                        >
                            {option.icon}
                        </Button>
                    </Link>
                );
            })}
        </div>
    );
}

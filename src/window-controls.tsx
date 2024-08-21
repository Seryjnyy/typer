import { FileTextIcon, GearIcon, KeyboardIcon } from "@radix-ui/react-icons";
import { Button } from "./components/ui/button";
import { useUiStateStore } from "./lib/store/ui-state-store";
import { Windows } from "./lib/types";
import { ReactNode } from "react";
import { cn } from "./lib/utils";
import { Link, useLocation } from "react-router-dom";
export default function WindowControls() {
    const location = useLocation();
    const locationSplit = location.pathname.split("/");
    const currentLocation = locationSplit.length > 0 ? locationSplit[1] : "";

    const options: { link: string[]; label: string; icon: ReactNode }[] = [
        { link: ["", "verse"], label: "Typer", icon: <KeyboardIcon /> },
        { link: ["songs"], label: "Songs", icon: <FileTextIcon /> },
        { link: ["settings"], label: "Settings", icon: <GearIcon /> },
    ];

    return (
        <div className="border rounded-md">
            {options.map((option, index) => {
                let className = "";
                if (index == 0) {
                    className = "rounded-l-md ";
                }
                if (index == options.length - 1) {
                    className = "rounded-r-md ";
                }

                return (
                    <Link to={option.link[0]} key={option.link[0]}>
                        <Button
                            size={"icon"}
                            variant={
                                option.link.includes(currentLocation)
                                    ? "default"
                                    : "ghost"
                            }
                            className={cn("rounded-none", className)}
                        >
                            {option.icon}
                        </Button>
                    </Link>
                );
            })}
        </div>
    );
}

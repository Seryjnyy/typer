import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import React from "react";
import TextModificationDialog from "../cylinder/text-modification-dialog";
import { Handlers } from "../types";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface ButtonsProps {
    handlers: Handlers;
}

export default function Buttons({ handlers }: ButtonsProps) {
    return (
        <div className="absolute sm:bottom-1 bottom-14 right-2 z-40 flex items-center gap-4">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            className=" text-xs"
                            variant={"ghost"}
                            size={"icon"}
                            onClick={() => {
                                handlers.onRestart?.();
                            }}
                        >
                            <ReloadIcon />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Restart</p>
                    </TooltipContent>
                </Tooltip>
                <TextModificationDialog />
            </TooltipProvider>
        </div>
    );
}

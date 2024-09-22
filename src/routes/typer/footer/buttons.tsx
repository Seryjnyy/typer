import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import React from "react";
import TextModificationDialog from "../cylinder/text-modification-dialog";
import { Handlers } from "../types";

interface ButtonsProps {
    handlers: Handlers;
}

export default function Buttons({ handlers }: ButtonsProps) {
    return (
        <div className="absolute sm:bottom-1 bottom-14 right-2 z-40 flex items-center gap-4">
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
            <TextModificationDialog />
        </div>
    );
}

import React from "react";
import { Button } from "./ui/button";
import { ArrowRightIcon, KeyboardIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const buttonVariants = cva("gap-2 group/button", {
    variants: {
        variant: {
            default: "",
            verse: "absolute -bottom-4 right-0 hidden group-hover/verse:flex group-hover/verse:bg-primary",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

interface KeyboardButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {}

export default function KeyboardButton({
    className,
    variant,
    ...props
}: KeyboardButtonProps) {
    return (
        <Button
            size={"sm"}
            className={cn(buttonVariants({ variant, className }))}
            {...props}
        >
            <KeyboardIcon />
            <ArrowRightIcon className="group-hover/button:translate-x-1 transition-transform opacity-60" />
        </Button>
    );
}

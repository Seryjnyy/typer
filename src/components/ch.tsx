import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import React, { forwardRef, HTMLAttributes } from "react";

// TODO : Better way to get type?
export type chVariant =
    | "start-of-line"
    | "current"
    | "currentInvisible"
    | "not-covered"
    | "correct"
    | "incorrect"
    | "incorrect-space"
    | "normal"
    | "normalInvisible";

export const chVariants = cva("", {
    variants: {
        variant: {
            "start-of-line": "bg-purple-400",
            current:
                "rounded-md relative before:content-[''] before:bg-yellow-400  before:px-[0.07rem] animate-pulse duration-1500 text-muted-foreground",
            currentInvisible:
                "invisible before:visible rounded-md relative before:content-[''] before:bg-yellow-400  before:px-[0.07rem] animate-pulse duration-1500 text-muted-foreground",
            "not-covered": "text-muted-foreground",
            correct: "text-green-200",
            incorrect: "text-red-200",
            "incorrect-space":
                "rounded-md bg-red-300 inline-block max-h-[1px] min-h-[1px] w-2",
            normal: "",
            normalInvisible: "invisible",
        },
    },
    defaultVariants: {
        variant: "not-covered",
    },
});

interface ChProps
    extends HTMLAttributes<HTMLSpanElement>,
        VariantProps<typeof chVariants> {}

const Ch = forwardRef<HTMLSpanElement, ChProps>(
    ({ className, variant, ...props }, ref) => {
        return (
            <span
                ref={ref}
                className={cn(chVariants({ variant, className }))}
                {...props}
            />
        );
    }
);

export default Ch;

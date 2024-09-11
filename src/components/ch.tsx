import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import React, { forwardRef, HTMLAttributes } from "react";

// TODO : Better way to get type?
export type chVariant =
    | "start-of-line"
    | "current"
    | "not-covered"
    | "correct"
    | "incorrect"
    | "incorrect-space"
    | "normal";

export const chVariants = cva("", {
    variants: {
        variant: {
            "start-of-line": "bg-purple-400",
            current:
                "rounded-md relative before:content-[''] before:bg-yellow-400  before:px-[0.07rem] before:animate-pulse duration-100 text-muted-foreground",
            "not-covered": "text-muted-foreground",
            correct: "text-green-800",
            incorrect: "text-red-800",
            "incorrect-space":
                "rounded-md bg-red-300 inline-block max-h-[1px] min-h-[1px] w-1",
            normal: "",
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

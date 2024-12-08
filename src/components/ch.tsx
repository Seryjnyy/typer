import { cn } from "@/lib/utils"
import { cva, VariantProps } from "class-variance-authority"
import { forwardRef, HTMLAttributes } from "react"

const chVariants = cva("", {
    variants: {
        variant: {
            current:
                "rounded-md relative before:content-['|'] before:bg-yellow-500 before:text-transparent before:px-[0.09rem] before:w-1" +
                " before:absolute before:animate-pulse before:duration-1500 ",
            currentInvisible:
                "invisible before:visible rounded-md relative before:content-[''] before:bg-yellow-400  before:px-[0.07rem]" +
                " animate-pulse duration-1500 text-muted-foreground", // Only used for the preview of text modification
            "not-covered": "text-muted-foreground",
            correct: "text-green-200",
            incorrect: "text-red-200",
            normal: "",
            normalInvisible: "invisible",
        },
    },
    defaultVariants: {
        variant: "not-covered",
    },
})

export type chVariant = VariantProps<typeof chVariants>["variant"]

interface ChProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof chVariants> {}

const Ch = forwardRef<HTMLSpanElement, ChProps>(({ className, variant, ...props }, ref) => {
    return <span ref={ref} className={cn(chVariants({ variant, className }))} {...props} />
})

export default Ch

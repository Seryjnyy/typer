import { forwardRef, HTMLProps, memo } from "react"
import { useTextModificationsStore } from "@/lib/store/text-modifications-store.tsx"
import Ch, { chVariant } from "@/components/ch.tsx"

interface LineBaseProps extends HTMLProps<HTMLDivElement> {
    line: string
    input: string
    isCurrentLine: boolean
    className?: string
}

const LineBase = forwardRef<HTMLDivElement, LineBaseProps>(({ line, input, isCurrentLine, className, ...props }, ref) => {
    const difficultyModifiers = useTextModificationsStore.use.harderOptions()
    console.log("line rerender", line)
    return (
        <div className={"tracking-wide"} ref={ref} {...props}>
            {line.split("").map((ch, index) => {
                const char = input.at(index)

                let variant: chVariant

                if (char === ch) {
                    variant = "correct"
                } else if (index >= input.length) {
                    if (isCurrentLine) {
                        variant = index === input.length ? "current" : "not-covered"
                    } else {
                        variant = "not-covered"
                    }
                } else {
                    if (ch == " " || ch == "\n") {
                        variant = "incorrect"
                        ch = "_"
                    } else {
                        variant = "incorrect"
                    }
                }

                if (variant != "correct" && variant != "incorrect") {
                    // current, not covered

                    if (isCurrentLine) {
                        if (difficultyModifiers.cantSeeAhead) {
                            if (ch != " " && input.length !== index) {
                                ch = "_"
                            }

                            // Don't replace char if it's a space
                            if (difficultyModifiers.cantSeeCurrent && !(ch == " " || ch == "\n")) {
                                ch = "_"
                            }

                            if (difficultyModifiers.cantSeeUnderlines && input.length !== index) {
                                variant = "normalInvisible"
                            }
                        }
                    } else {
                        if (difficultyModifiers.cantSeeAhead) {
                            if (ch != " ") {
                                ch = "_"
                            }

                            if (difficultyModifiers.cantSeeUnderlines) {
                                variant = "normalInvisible"
                            }
                        }
                    }
                }
                return (
                    <Ch key={`char-${index}`} variant={variant} className={className}>
                        {ch}
                    </Ch>
                )
            })}
        </div>
    )
})

const Line = memo(LineBase)

export default Line

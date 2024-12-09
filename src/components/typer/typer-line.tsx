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

    return (
        <div className={"tracking-wide"} ref={ref} {...props}>
            {Array.from(line).map((ch, index) => {
                const char = input.at(index)

                let variant: chVariant

                // TODO : potential issue, multiple whitespaces in a row don't render as expected, they all combine into a single
                //  whitespace that fools the user into thinking they are onto the next part. This is partly fixed for now by removing
                //  multiple whitespaces when saving the content of a song.e
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

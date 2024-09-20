import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

import { useComboboxContext } from "./context";
import { PlusIcon } from "lucide-react";

export const ComboboxAdd = ({
    className,
    children,
    ...props
}: ComponentPropsWithoutRef<"div">) => {
    const { inputValue } = useComboboxContext();
    console.log(inputValue);

    // if (filteredItems && filteredItems.length > 0) return null;

    return (
        <li
            // {...props}
            // data-index={index}
            className={cn(
                `relative flex cursor-default select-none flex-col rounded-sm px-3 py-1.5 aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-selected:bg-accent aria-selected:text-accent-foreground`,
                !children && "ps-8",
                className
            )}
            // {...getItemProps?.({ item, index })}
        >
            {children || (
                <>
                    <span className="text-sm text-foreground">{"label"}</span>
                    {/* {isSelected && (
                        <span className="absolute start-3 top-0 flex h-full items-center justify-center">
                            <CircleIcon className="size-2 fill-current" />
                        </span>
                    )} */}
                </>
            )}
        </li>
    );
};

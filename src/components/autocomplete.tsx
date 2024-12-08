import { cn } from "@/lib/utils"
import { Command as CommandPrimitive } from "cmdk"
import { PlusIcon } from "lucide-react"
import { ReactNode, useMemo, useState } from "react"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"

type Props<T extends string> = {
    selectedValue: T
    onSelectedValueChange: (value: T) => void
    searchValue: string
    onSearchValueChange: (value: string) => void
    items: { value: T; label: string }[]
    isLoading?: boolean
    emptyMessage?: string
    placeholder?: string
    saveInputAsSelected?: boolean
    maxItemRender?: number
    listTitle?: ReactNode
}

// Component from here v, slightly modified
// to take input as value, fixed covered focus outline on input, added max item render, added prepend component as title, fixed onblur not closing popover if two or more popovers in a row, and some other stuff
// https://leonardomontini.dev/shadcn-autocomplete/
// TODO : whitespace kinda annoying, can spam whitespace and it considers it a new item, not detrimental but a slight detail
// TODO : NONE OF THIS WORK WELL RN
export function AutoComplete<T extends string>({
    selectedValue,
    onSelectedValueChange,
    searchValue,
    onSearchValueChange,
    items,
    isLoading,
    listTitle,
    saveInputAsSelected = false,
    emptyMessage = "No items.",
    placeholder = "",
    maxItemRender = 7,
}: Props<T>) {
    const [open, setOpen] = useState(false)

    const labels = useMemo(
        () =>
            items.reduce(
                (acc, item) => {
                    acc[item.value] = item.label
                    return acc
                },
                {} as Record<string, string>
            ),
        [items]
    )

    const reset = () => {
        // Reset state if we are not taking the input as a value
        if (!saveInputAsSelected) {
            onSelectedValueChange("" as T)
            onSearchValueChange("")
        }
    }

    const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (!e.relatedTarget?.hasAttribute("cmdk-list") && labels[selectedValue] !== searchValue) {
            reset()
        }

        setOpen(false)
    }

    const onSelectItem = (inputValue: string) => {
        if (inputValue === selectedValue) {
            reset()
        } else {
            onSelectedValueChange(inputValue as T)
            onSearchValueChange(labels[inputValue] ?? "")
        }
        setOpen(false)
    }

    let filteredItems = items.filter((item) => !searchValue || item.label.toLocaleLowerCase().includes(searchValue.toLowerCase()))

    let create = false

    if (
        saveInputAsSelected &&
        searchValue != "" &&
        filteredItems.find((x) => x.label.toLowerCase() === searchValue.toLowerCase()) == undefined
        // && filteredItems.length == 0
    ) {
        filteredItems.unshift({ label: searchValue, value: searchValue as T })
        // TODO : Sometimes input can equal value, so it gets a tick, but that value can be anywhere, feel like it should be at the top

        create = true
    }

    return (
        <div className="flex items-center ">
            <Popover open={open} onOpenChange={setOpen}>
                <Command shouldFilter={false} className="p-[1px] bg-transparent -translate-y-[1px]">
                    <PopoverAnchor asChild>
                        <CommandPrimitive.Input
                            asChild
                            value={searchValue}
                            onValueChange={(val) => {
                                if (saveInputAsSelected) {
                                    onSelectedValueChange(val as T)
                                }

                                onSearchValueChange(val)
                            }}
                            onKeyDown={(e) => setOpen(e.key !== "Escape")}
                            onMouseDown={() => setOpen((open) => !!searchValue || !open)}
                            onFocus={() => setOpen(true)}
                            onBlur={onInputBlur}
                            className="bg-background "
                        >
                            <Input placeholder={placeholder} />
                        </CommandPrimitive.Input>
                    </PopoverAnchor>
                    {!open && <CommandList aria-hidden="true" className="hidden" />}
                    <PopoverContent
                        asChild
                        onOpenAutoFocus={(e) => e.preventDefault()}
                        onInteractOutside={(e) => {
                            if (e.target instanceof Element && e.target.hasAttribute("cmdk-input")) {
                                e.preventDefault()
                            }
                        }}
                        className={cn("w-[--radix-popover-trigger-width] p-0", {
                            "sr-only": filteredItems.length == 0 && !isLoading,
                        })}
                    >
                        <CommandList>
                            <div className="pl-6">{listTitle}</div>
                            {isLoading && (
                                <CommandPrimitive.Loading>
                                    <div className="p-1">
                                        <Skeleton className="h-6 w-full" />
                                    </div>
                                </CommandPrimitive.Loading>
                            )}
                            {filteredItems.length > 0 && !isLoading ? (
                                <CommandGroup>
                                    {filteredItems.slice(0, maxItemRender).map((option) => (
                                        <CommandItem
                                            key={option.value}
                                            value={option.value}
                                            onMouseDown={(e) => e.preventDefault()}
                                            onSelect={onSelectItem}
                                            className={cn("overflow-hidden  text-wrap text-center ", {
                                                "pl-6": saveInputAsSelected && !create,
                                            })}
                                        >
                                            {/* {!create && (
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            selectedValue ===
                                                                option.value
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                )} */}
                                            {saveInputAsSelected && create && (
                                                <PlusIcon
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedValue === option.value ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                            )}
                                            <span className="w-full">{option.label}</span>
                                        </CommandItem>
                                    ))}
                                    {filteredItems.length > maxItemRender && (
                                        <span className="w-full flex justify-center pl-6 text-muted-foreground">...</span>
                                    )}
                                </CommandGroup>
                            ) : null}
                            {!isLoading ? <CommandEmpty className="sr-only">{emptyMessage ?? "No items."}</CommandEmpty> : null}
                        </CommandList>
                    </PopoverContent>
                </Command>
            </Popover>
        </div>
    )
}

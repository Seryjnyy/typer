import { useEffect, useMemo, useState } from "react";
import { CheckIcon, PlusIcon } from "lucide-react";
import {
    ComboBox,
    ComboboxAdd,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    useComboboxContext,
} from "./combobox";
import { useSongStore } from "@/lib/store/song-store";
import { Button } from "./ui/button";
import { title } from "process";

// export const BOOKS = [
//     { id: "book-1", title: "To Kill a Mockingbird" },
//     { id: "book-2", title: "War and Peace" },
//     { id: "book-3", title: "The Idiot" },
//     { id: "book-4", title: "A Picture of Dorian Gray" },
//     { id: "book-5", title: "1984" },
//     { id: "book-6", title: "Pride and Prejudice" },
//     { id: "book-7", title: "Meditations" },
//     {
//         id: "book-8",
//         title: "The Brothers Karamazov",
//     },
//     { id: "book-9", title: "Anna Karenina" },
//     {
//         id: "book-10",
//         title: "Crime and Punishment",
//     },
// ] satisfies { id: string; title: string }[];

export const ComboboxDemo = () => {
    const songList = useSongStore.use.songs();
    const [value, setValue] = useState<string | null>(null);
    const sources = useMemo(() => {
        const s = [...new Set(songList.map((song) => song.source))];
        return [
            ...s.map((x, i) => ({ id: i.toString(), title: x })),
            { id: "fds", title: value ?? "" },
        ];
    }, [songList, value]);

    // const bookByValue = useMemo(
    //     () => (value && sources.find((book) => book.id === value)) || null,
    //     [value]
    // );

    return (
        <>
            <ComboBox
                value={value}
                onValueChange={setValue}
                filterItems={(inputValue, items) => {
                    return [
                        ...items.filter(({ value }) => {
                            const book = sources.find(
                                (book) => book.id === value
                            );
                            return (
                                !inputValue ||
                                (book &&
                                    book.title
                                        .toLowerCase()
                                        .includes(inputValue.toLowerCase()))
                            );
                        }),
                        // { label: inputValue, value: inputValue },
                    ];
                }}
            >
                <ComboboxInput placeholder="Enter or pick a source..." />
                <ComboboxContent>
                    {sources.map(({ id, title }) => (
                        <ComboboxItem
                            key={id}
                            value={id}
                            label={title}
                            disabled={id === "book-5"}
                            className="ps-8"
                        >
                            <span className="text-sm text-foreground">
                                {title}
                            </span>
                            {value === id && (
                                <span className="absolute start-2 top-0 flex h-full items-center justify-center">
                                    <CheckIcon className="size-4" />
                                </span>
                            )}
                        </ComboboxItem>
                    ))}

                    {/* <ComboboxEmpty>
                        <Button variant={"ghost"}>
                            <PlusIcon /> Add this source
                        </Button>
                    </ComboboxEmpty> */}
                    {/* <ComboboxAdd className="text-xs flex items-center gap-1">
                        <PlusIcon />

                        <span> Add this source</span>
                    </ComboboxAdd> */}
                </ComboboxContent>
            </ComboBox>
        </>
    );
};

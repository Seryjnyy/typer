import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

import { AutoComplete } from "@/components/autocomplete";
import useCreateSong from "@/lib/hooks/use-create-song";
import { songSchema, songSchemaType } from "@/lib/schemas/song";
import { useSongStore } from "@/lib/store/song-store";
import { cn, generateGradient } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import SongContentFormField from "./song-content-form-field";

interface SourceAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    resetState: boolean;
}

// TODO : Probably should take field props, then this should probably pass it to the search
export const SourceAutocomplete = ({
    value,
    onChange,
    resetState,
}: SourceAutocompleteProps) => {
    const songsList = useSongStore.use.songs();
    const [searchValue, setSearchValue] = useState<string>(value);
    const [selectedValue, setSelectedValue] = useState<string>(value);

    const artistsSet = useMemo(() => {
        const artistSet = new Set<string>();
        songsList.forEach((x) => artistSet.add(x.source));
        return Array.from(artistSet.values());
    }, [songsList]);

    // Sometimes artistSet won't change when song list changes, so I think its a bit more efficient like this
    const data = useMemo(() => {
        return artistsSet.map((artist) => ({ value: artist, label: artist }));
    }, [artistsSet]);

    const handleSelectedValueChange = (val: string) => {
        // setSelectedValue(val);
        onChange(val);
    };

    // TODO : Bit of a hack but eh
    // useEffect(() => {
    //     if (resetState == undefined) return;
    //     setSearchValue("");
    //     setSelectedValue("");
    // }, [resetState]);

    return (
        <AutoComplete
            listTitle={
                <span className="text-xs flex justify-center text-muted-foreground py-1">
                    Existing sources
                </span>
            }
            saveInputAsSelected
            selectedValue={selectedValue}
            onSelectedValueChange={handleSelectedValueChange}
            searchValue={searchValue}
            onSearchValueChange={setSearchValue}
            items={data ?? []}
        />
    );
};

export const TitleAutocomplete = ({
    value,
    onChange,
    resetState,
}: SourceAutocompleteProps) => {
    const songsList = useSongStore.use.songs();
    const [searchValue, setSearchValue] = useState<string>(value);
    const [selectedValue, setSelectedValue] = useState<string>(value);

    const titlesSet = useMemo(() => {
        const titlesSet = new Set<string>(songsList.map((x) => x.title));
        // songsList.forEach((x) => titlesSet.add(x.source));
        return Array.from(titlesSet.values());
    }, [songsList]);

    // Sometimes artistSet won't change when song list changes, so I think its a bit more efficient like this
    const data = useMemo(() => {
        return titlesSet.map((title) => ({ value: title, label: title }));
    }, [titlesSet]);

    const handleSelectedValueChange = (val: string) => {
        setSelectedValue(val);
        onChange(val);
    };

    // TODO : Bit of a hack but eh
    useEffect(() => {
        if (resetState == undefined) return;
        setSearchValue("");
        setSelectedValue("");
    }, [resetState]);

    return (
        <AutoComplete
            listTitle={
                <span className="text-xs flex justify-center text-muted-foreground py-1">
                    Existing song titles
                </span>
            }
            saveInputAsSelected
            selectedValue={selectedValue}
            onSelectedValueChange={handleSelectedValueChange}
            searchValue={searchValue}
            onSearchValueChange={setSearchValue}
            items={data ?? []}
        />
    );
};

export default function CreateSongForm({
    onSuccess,
}: {
    onSuccess?: () => void;
}) {
    const createSong = useCreateSong();
    const { toast } = useToast();
    const formRef = useRef<HTMLInputElement>(null);
    const [resetChildState, setResetChildState] = useState(false);

    const form = useForm<songSchemaType>({
        resolver: zodResolver(songSchema),
        defaultValues: {
            source: "",
            title: "",
            content: "",
            cover: generateGradient(),
        },
    });

    function onSubmit(values: songSchemaType) {
        console.log(values);

        const song = {
            title: values.title,
            content: values.content.trim(),
            source: values.source,
            cover: values.cover,
        };

        const result = createSong(song, true);

        if (!result) return;

        // Reset the state that doesn't get reset automatically
        form.reset({ cover: generateGradient() });
        form.reset({ source: "" });
        setResetChildState((prev) => !prev);

        formRef.current?.focus();
        if (onSuccess) onSuccess();
    }

    return (
        <ScrollArea className="h-[100%] px-2 sm:px-6 md:px-12   overflow-hidden border-t ">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 mt-8 sm:mb-2 mb-4"
                >
                    <div className="flex gap-8 items-end flex-wrap w-full">
                        <FormField
                            control={form.control}
                            name="cover"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cover</FormLabel>
                                    <FormControl>
                                        <div className="flex gap-2 items-end">
                                            <div
                                                className={cn(
                                                    field.value,
                                                    "w-20 h-20 rounded-md"
                                                )}
                                            ></div>
                                            <Button
                                                type="button"
                                                variant={"outline"}
                                                onClick={() =>
                                                    form.setValue(
                                                        "cover",
                                                        generateGradient()
                                                    )
                                                }
                                            >
                                                <Icons.dice className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormDescription className="sr-only">
                                        This is the cover of the song.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mx-1">
                            {/* <FormField
                                control={form.control}
                                name={"title"}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="space-x-1">
                                            <span>Title</span>
                                            <span className="text-xs text-muted-foreground">
                                                (Song name)
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} ref={formRef} />
                                        </FormControl>
                                        <FormDescription className="sr-only">
                                            This is the name of the song.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}
                            <FormField
                                control={form.control}
                                name={"title"}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="space-x-1">
                                            <span>Title</span>
                                            <span className="text-xs text-muted-foreground">
                                                (Song name)
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <TitleAutocomplete
                                                value={field.value}
                                                onChange={field.onChange}
                                                resetState={resetChildState}
                                            />
                                        </FormControl>
                                        <FormDescription className="sr-only">
                                            This is the name of the song.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* <FormField
                                control={form.control}
                                name="source"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="space-x-1">
                                            <span>Source</span>
                                            <span className="text-xs text-muted-foreground">
                                                (Artist)
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormDescription className="sr-only">
                                            This is the name of the source of
                                            the song.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}
                            <FormField
                                control={form.control}
                                name="source"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="space-x-1">
                                            <span>Source</span>
                                            <span className="text-xs text-muted-foreground">
                                                (Artist)
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            {/* <Input {...field} /> */}
                                            <SourceAutocomplete
                                                value={field.value}
                                                onChange={field.onChange}
                                                resetState={resetChildState}
                                            />
                                        </FormControl>
                                        <FormDescription className="sr-only">
                                            This is the name of the source of
                                            the song.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <SongContentFormField
                        form={form}
                        resetState={resetChildState}
                    />

                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </ScrollArea>
    );
}

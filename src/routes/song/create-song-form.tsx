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
import { Input } from "@/components/ui/input";

interface SourceAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    resetState: boolean;
}

export default function CreateSongForm({
    onSuccess,
}: {
    onSuccess?: () => void;
}) {
    const createSong = useCreateSong();
    const { toast } = useToast();
    const titleInputRef = useRef<HTMLInputElement>(null);
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

        titleInputRef.current?.focus();
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
                                            <Input
                                                {...field}
                                                ref={titleInputRef}
                                            />
                                        </FormControl>
                                        <FormDescription className="sr-only">
                                            This is the name of the song.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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
                                            <Input {...field} />
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

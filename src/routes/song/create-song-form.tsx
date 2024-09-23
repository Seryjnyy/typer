import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { songSchema, songSchemaType } from "@/lib/schemas/song";
import { useSongStore } from "@/lib/store/song-store";
import { Song } from "@/lib/types";
import {
    cn,
    generateGradient,
    seeSizeOfStringInLocalStorage,
    textModification,
} from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaretDownIcon, Cross1Icon, ResetIcon } from "@radix-ui/react-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import SongContentFormField from "./song-content-form-field";

export default function CreateSongForm({
    onSuccess,
}: {
    onSuccess?: () => void;
}) {
    const songStore = useSongStore();
    const { toast } = useToast();
    const formRef = useRef<HTMLInputElement>(null);
    const [resetChildState, setResetChildState] = useState(false);
    const artists = useMemo(() => {
        const artistSet = new Set<string>();
        songStore.songs.forEach((x) => artistSet.add(x.source));
        return Array.from(artistSet.values());
    }, [songStore.songs]);

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

        const song: Song = {
            id: uuidv4(),
            title: values.title,
            content: values.content.trim(),
            source: values.source,
            completion: 0,
            record: { accuracy: 0, wpm: 0 },
            cover: values.cover,
            createdAt: Date.now(),
            lastModifiedAt: Date.now(),
        };

        try {
            songStore.addSong(song);
        } catch (e) {
            console.error("oh no this is not going to work");
            console.log(
                "SIZE::::::",
                seeSizeOfStringInLocalStorage(JSON.stringify(song))
            );
            toast({
                title: "Failed to add song.",
                description: `It seems like storage is full or this song is too long. ${
                    JSON.stringify(localStorage).length
                }storage size ${JSON.stringify(song).length}`,
                variant: "destructive",
            });
            return;
        }

        form.reset({ cover: generateGradient() });
        setResetChildState((prev) => !prev);

        toast({
            title: "Successfully added your song.",
            description: `${values.title} - ${values.source}`,
            variant: "success",
            action: (
                <Link to={`/songs/${song.id}`}>
                    <Button variant={"outline"}>View song</Button>
                </Link>
            ),
        });

        formRef.current?.focus();
        if (onSuccess) onSuccess();
    }

    return (
        <ScrollArea className="h-[100%] px-2 sm:px-6 md:px-12 sm:pb-2 pb-4  rounded-md overflow-hidden border-t rounded-t-none ">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 mt-8"
                >
                    <div className="flex gap-16 items-end flex-wrap">
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
                        <div className="flex gap-8 flex-wrap mx-1">
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
                                            <Input {...field} ref={formRef} />
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

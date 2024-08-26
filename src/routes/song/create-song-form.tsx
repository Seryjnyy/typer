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
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { songSchema, songSchemaType } from "@/lib/schemas/song";
import { useSongStore } from "@/lib/store/song-store";
import { cn, generateGradient } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

export default function CreateSongForm({
    onSuccess,
}: {
    onSuccess?: () => void;
}) {
    const songStore = useSongStore();
    const { toast } = useToast();
    const formRef = useRef<HTMLInputElement>(null);
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

        songStore.addSong({
            id: uuidv4(),
            title: values.title,
            content: values.content,
            source: values.source,
            completion: 0,
            cover: values.cover,
        });

        form.reset({ cover: generateGradient() });
        toast({
            title: "Successfully added your song.",
            description: `${values.title} - ${values.source}`,
            variant: "success",
        });

        formRef.current?.focus();
        if (onSuccess) onSuccess();
    }

    console.log(form.getValues().cover);
    return (
        <ScrollArea className="h-[calc(100%)] pb-2">
            <Form {...form}>
                {/* <Autocomplete /> */}
                {/* <Test /> */}
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    <FormField
                        control={form.control}
                        name={"title"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title </FormLabel>
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
                                <FormLabel>Source</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription className="sr-only">
                                    This is the name of the source of the song.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Content</FormLabel>
                                <FormControl>
                                    <Textarea {...field} />
                                </FormControl>
                                <FormDescription className="sr-only">
                                    This is the content of the song. It is what
                                    you will be typing.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </ScrollArea>
    );
}
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useSongStore } from "@/lib/store/song-store";
import { cn, generateGradient } from "@/lib/utils";
import { songSchema, songSchemaType } from "@/lib/schemas/song";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Song } from "@/lib/types";
import { Icons } from "@/components/icons";
import { useNavigate } from "react-router-dom";

export default function EditSongForm({
    onSuccess,
    song,
}: {
    onSuccess?: () => void;
    song: Song;
}) {
    const songStore = useSongStore();
    const { toast } = useToast();
    const formRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const form = useForm<songSchemaType>({
        resolver: zodResolver(songSchema),
        defaultValues: {
            source: song.source,
            title: song.title,
            content: song.content,
            cover: song.cover,
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
            cover: generateGradient(),
            record: { accuracy: 0, chpm: 0 },
        });

        form.reset();
        toast({
            title: "Successfully edited your song.",
            description: `${values.title} - ${values.source}`,
            variant: "success",
        });

        formRef.current?.focus();
        if (onSuccess) onSuccess();
    }

    return (
        <Form {...form}>
            {/* <Autocomplete /> */}
            {/* <Test /> */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Title{" "}
                                {field.value != song.title ? (
                                    <span className="text-primary">*</span>
                                ) : (
                                    ""
                                )}
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
                            <FormLabel>
                                Source{" "}
                                {field.value != song.source ? (
                                    <span className="text-primary">*</span>
                                ) : (
                                    ""
                                )}
                            </FormLabel>
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
                            <FormLabel>
                                Content{" "}
                                {field.value != song.content ? (
                                    <span className="text-primary">*</span>
                                ) : (
                                    ""
                                )}
                            </FormLabel>
                            <FormControl>
                                <Textarea {...field} />
                            </FormControl>
                            <FormDescription className="sr-only">
                                This is the content of the song. It is what you
                                will be typing.
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
                            <FormLabel>
                                Cover{" "}
                                {field.value != song.cover ? (
                                    <span className="text-primary">*</span>
                                ) : (
                                    ""
                                )}
                            </FormLabel>
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
                <div className="space-x-4 pt-8">
                    <Button
                        type="button"
                        variant={"ghost"}
                        onClick={() => {
                            navigate("/songs");
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={
                            form.getValues().title == song.title &&
                            form.getValues().content == song.content &&
                            form.getValues().cover == song.cover &&
                            form.getValues().source == song.source
                        }
                    >
                        Submit
                    </Button>
                </div>
            </form>
        </Form>
    );
}

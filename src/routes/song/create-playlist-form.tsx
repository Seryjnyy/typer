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
import usePlaylist from "@/lib/hooks/use-playlist";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const createPlaylistSchema = z.object({
    title: z
        .string()
        .min(1, "Title must be at least 1 character.")
        .max(150, "Title must be less than 150 characters.")
        .regex(/\S+/, {
            message: "Title cannot be just whitespace characters.",
        }),
});

export type createPlaylistSchemaType = z.infer<typeof createPlaylistSchema>;

export default function CreatePlaylistForm({
    onCancel,
    onSave,
    songs,
}: {
    onCancel?: () => void;
    onSave?: () => void;
    songs?: string[];
}) {
    const { createPlaylist } = usePlaylist();
    const form = useForm<createPlaylistSchemaType>({
        resolver: zodResolver(createPlaylistSchema),
        defaultValues: {
            title: "",
        },
    });

    function onSubmit(values: createPlaylistSchemaType) {
        createPlaylist({ title: values.title, songs: songs });

        form.reset();
        onSave?.();
        // const song = {
        //     title: values.title,
        //     content: values.content.trim(),
        //     source: values.source,
        //     cover: values.cover,
        // };
        // const result = createSong(song, true);
        // if (!result) return;
        // Reset the state that doesn't get reset automatically
        // form.reset({ cover: generateGradient() });
        // setResetChildState((prev) => !prev);
        // formRef.current?.focus();
        // if (onSuccess) onSuccess();
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className=" h-[calc(100%-0.5rem)] flex flex-col gap-10 pt-10"
            >
                <FormField
                    control={form.control}
                    name={"title"}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="space-x-1">
                                <span>Title</span>
                            </FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormDescription className="sr-only">
                                This is the name of the playlist.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex basis-1/2 gap-1">
                    <Button
                        className="w-full"
                        variant={"secondary"}
                        type="button"
                        onClick={() => onCancel?.()}
                    >
                        Cancel
                    </Button>
                    <Button className="w-full">Save</Button>
                </div>
            </form>
        </Form>
    );
}

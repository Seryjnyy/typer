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
import usePlaylists from "@/lib/hooks/use-playlists";
import {
    createPlaylistSchemaType,
    playlistSchema,
} from "@/lib/schemas/playlist";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function CreatePlaylistForm({
    onCancel,
    onSave,
    songs,
}: {
    onCancel?: () => void;
    onSave?: () => void;
    songs?: string[];
}) {
    const { createPlaylist } = usePlaylists();
    const form = useForm<createPlaylistSchemaType>({
        resolver: zodResolver(playlistSchema),
        defaultValues: {
            title: "",
        },
    });

    function onSubmit(values: createPlaylistSchemaType) {
        createPlaylist({ title: values.title, songs: songs });

        form.reset();
        onSave?.();
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

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
import { Playlist } from "@/lib/store/playlist-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PlaylistBanner, PlaylistHeader } from "../playlist-header";
import { useNavigate } from "react-router";

export default function PlaylistEditForm({ playlist }: { playlist: Playlist }) {
    const { editPlaylist } = usePlaylists();
    const navigate = useNavigate();

    const form = useForm<createPlaylistSchemaType>({
        resolver: zodResolver(playlistSchema),
        defaultValues: {
            title: playlist.title,
        },
    });

    function onSubmit(values: createPlaylistSchemaType) {
        editPlaylist({ ...playlist, title: values.title });

        form.reset();
        navigate(`/songs/playlist/${playlist.id}`);
    }

    console.log(playlist);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className=" h-[calc(100%-0.5rem)] flex flex-col gap-10 pt-10"
            >
                <div className="flex items-end justify-start gap-12 flex-wrap">
                    <PlaylistHeader className="w-fit">
                        <PlaylistBanner playlist={playlist} size={"xl"} />
                    </PlaylistHeader>
                    <FormField
                        control={form.control}
                        name={"title"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="space-x-1">
                                    Title{" "}
                                    {field.value != playlist.title ? (
                                        <span className="text-primary">*</span>
                                    ) : (
                                        ""
                                    )}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        className="max-w-[18rem]"
                                    />
                                </FormControl>
                                <FormDescription className="sr-only">
                                    This is the name of the playlist.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex justify-between gap-2 mt-12">
                    <Button
                        variant={"ghost"}
                        type="button"
                        onClick={() =>
                            navigate(`/songs/playlist/${playlist.id}`)
                        }
                    >
                        Cancel
                    </Button>
                    <Button disabled={form.getValues().title == playlist.title}>
                        Submit
                    </Button>
                </div>
            </form>
        </Form>
    );
}

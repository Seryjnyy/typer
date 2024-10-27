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

import SpotifyEnable from "@/components/spotify/spotify-enable";
import { Input } from "@/components/ui/input";
import useCreateSong from "@/lib/hooks/use-create-song";
import { songSchema, songSchemaType } from "@/lib/schemas/song";
import { cn, generateGradient } from "@/lib/utils";
import { useSpotify } from "@/spotify/use-spotify";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import SongContentFormField from "./song-content-form-field";

import FindSongUsingSpotify from "@/components/spotify/find-song-using-spotify";
import SearchForLyrics from "@/components/spotify/search-for-lyrics";
import { UseFormReturn } from "react-hook-form";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CreateSongForm({
    onSuccess,
}: {
    onSuccess?: () => void;
}) {
    const createSong = useCreateSong();
    // TODO : can't do focus on input after submit for spotify like its in manual because it gets rerendered with through changing key
    const titleInputRef = useRef<HTMLInputElement>(null);

    const [resetChildState, setResetChildState] = useState(false);

    const randomGradient = useMemo(() => generateGradient(), []);

    const form = useForm<songSchemaType>({
        resolver: zodResolver(songSchema),
        defaultValues: {
            source: "",
            title: "",
            content: "",
            cover: randomGradient,
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

        form.reset({
            title: "",
            source: "",
            content: "",
            cover: generateGradient(),
        });
        setResetChildState((prev) => !prev);

        titleInputRef.current?.focus();

        if (onSuccess) onSuccess();
    }

    const [title, source] = form.watch(["title", "source"]);
    return (
        <ScrollArea className="h-[100%] px-2 sm:px-6 md:px-12   overflow-hidden border-t ">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 mt-8 sm:mb-2 mb-4"
                >
                    <div className="flex gap-8 items-end flex-wrap w-full">
                        <div className="flex items-end flex-wrap gap-8">
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
                            <div className="flex gap-1 flex-wrap items-end  h-fit">
                                <span className="text-xl font-[900] max-w-[80vw] break-words w-fit space-x-2">
                                    {title}
                                    {title.length > 0 && source.length > 0 && (
                                        <span className="text-muted-foreground pl-2">
                                            by
                                        </span>
                                    )}
                                    <span className="break-words ">
                                        {source}
                                    </span>
                                </span>
                            </div>
                        </div>
                        <Tabs
                            defaultValue="manual"
                            className="w-full border p-2 rounded-2xl"
                        >
                            <TabsList>
                                <TabsTrigger value="manual">Manual</TabsTrigger>
                                <TabsTrigger
                                    value="spotify"
                                    className="flex items-center gap-2"
                                >
                                    <Icons.spotify className="size-5" />
                                    Use Spotify
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="manual">
                                <ManualArtistTrack
                                    form={form}
                                    ref={titleInputRef}
                                />
                            </TabsContent>
                            <TabsContent value="spotify">
                                <SpotifyArtistTrack
                                    form={form}
                                    triggerRerender={resetChildState}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                    <SongContentFormField
                        form={form}
                        resetState={resetChildState}
                    />
                    <SearchForLyrics artist={source} track={title} />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </ScrollArea>
    );
}

interface SpotifyArtistTrackProps {
    triggerRerender: boolean;
    form: UseFormReturn<
        {
            source: string;
            title: string;
            content: string;
            cover: string;
        },
        any,
        undefined
    >;
}

const SpotifyArtistTrack = ({
    form,
    triggerRerender,
}: SpotifyArtistTrackProps) => {
    const { apiSDK } = useSpotify({});

    const handleSelectSong = ({
        title,
        artist,
    }: {
        title: string;
        artist: string;
    }) => {
        form.setValue("title", title);
        form.setValue("source", artist);
    };

    return (
        <div className="space-y-6 px-1">
            <div className="pt-2">
                <SpotifyEnable redirectPath="/songs?tab=add-song" />
            </div>
            {apiSDK && (
                <FindSongUsingSpotify
                    key={triggerRerender ? "r" : "n"}
                    apiSDK={apiSDK}
                    onSelectSong={handleSelectSong}
                    initialTitle={form.getValues().title}
                />
            )}
        </div>
    );
};

interface ManualArtistTrackProps {
    form: UseFormReturn<
        {
            source: string;
            title: string;
            content: string;
            cover: string;
        },
        any,
        undefined
    >;
}

const ManualArtistTrack = forwardRef<HTMLInputElement, ManualArtistTrackProps>(
    ({ form }: ManualArtistTrackProps, ref) => {
        return (
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
                                <Input {...field} ref={ref} />
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
                                This is the name of the source of the song.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        );
    }
);

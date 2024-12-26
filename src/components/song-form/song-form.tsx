import { useForm, useFormContext } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Icons } from "@/components/icons.tsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { forwardRef, useMemo, useState } from "react"
import { coverAsStyle, createRandomCover, createRandomCoverWithColours, parseGeneratedCoverString } from "@/lib/gradient.ts"
import { cn } from "@/lib/utils.ts"
import { Check, Trash, Undo, X } from "lucide-react"
import ContentFormFieldItem from "@/components/song-form/content-form-field-item.tsx"
import { v4 as uuidv4 } from "uuid"
import { Input } from "@/components/ui/input.tsx"
import { Track } from "@spotify/web-api-ts-sdk"
import SpotifyFeatureGuard from "@/components/spotify/spotify-feature-guard.tsx"
import SpotifyWebSDKProvider from "@/components/spotify/providers/spotify-web-sdk-provider.tsx"
import FindSongUsingSpotify from "@/components/spotify/search/find-song-using-spotify.tsx"
import { Label } from "@/components/ui/label.tsx"
import { Checkbox } from "@/components/ui/checkbox.tsx"
import { getPalette } from "color-thief-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { ScrollArea } from "../ui/scroll-area"
import { useUpsertSong } from "@/components/song-form/use-upsert-song.tsx"
import { createSongSchema, CreateSongSchemaType } from "@/lib/schemas/song.ts"

export default function SongForm({
    initialValues,
    onSuccess,
}: {
    initialValues?: Omit<CreateSongSchemaType, "useSpotifyCover">
    onSuccess?: () => void
}) {
    const [id, setId] = useState(uuidv4())
    const randomCoverGradient = useMemo(() => createRandomCover(), [])
    const form = useForm<CreateSongSchemaType>({
        resolver: zodResolver(createSongSchema),
        defaultValues: {
            id: initialValues?.id ?? undefined,
            source: initialValues?.source ?? "",
            title: initialValues?.title ?? "",
            content: initialValues?.content ?? "",
            cover: initialValues?.cover ?? JSON.stringify(randomCoverGradient),
            spotifyUri: initialValues?.spotifyUri ?? undefined,
            spotifyCover: initialValues?.spotifyCover ?? undefined,
            useSpotifyCover: true,
        },
    })
    const upsertSong = useUpsertSong()

    const onSubmit = (data: CreateSongSchemaType) => {
        const result = upsertSong({
            id: data.id,
            title: data.title,
            source: data.source,
            content: data.content,
            cover: data.cover,
            spotifyUri: data.spotifyUri,
            spotifyCover: data.useSpotifyCover ? data.spotifyCover : undefined,
        })

        if (!result) return

        form.reset({
            ...form.formState.defaultValues,
            cover: JSON.stringify(createRandomCover()),
        })

        setId(uuidv4())
        onSuccess?.()
    }

    // getValues would work too I think since it re-renders on each change
    const currentValues = form.watch()

    return (
        <ScrollArea className="h-[100%] px-2 sm:px-6 md:px-12   overflow-hidden border-t ">
            <Form {...form} key={id}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8 sm:mb-2 mb-4">
                    <div className="flex gap-8 items-end flex-wrap w-full">
                        <div className="flex items-end flex-wrap gap-8">
                            <FormField
                                control={form.control}
                                name="cover"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Cover
                                            {JSON.stringify(form.formState.defaultValues?.cover) === JSON.stringify(field.value) ? "" : "*"}
                                        </FormLabel>

                                        <FormControl>
                                            <div className="flex gap-2 items-end ">
                                                {currentValues.spotifyCover && (
                                                    <div className={"w-20 h-20 rounded-md relative"}>
                                                        <img
                                                            src={currentValues.spotifyCover}
                                                            alt={"Album cover."}
                                                            className={"w-20 h-20 rounded-md"}
                                                        />
                                                        {currentValues.useSpotifyCover ? (
                                                            <Check
                                                                className={
                                                                    "absolute bottom-0 right-0 backdrop-blur-xl rounded-tl rounded-br-md"
                                                                }
                                                            />
                                                        ) : (
                                                            <X
                                                                className={
                                                                    "absolute bottom-0 right-0 backdrop-blur-xl rounded-tl rounded-br-md"
                                                                }
                                                            />
                                                        )}
                                                    </div>
                                                )}

                                                <div
                                                    className={cn("w-20 h-20 rounded-md relative overflow-hidden")}
                                                    style={field.value ? coverAsStyle(parseGeneratedCoverString(field.value)) : undefined}
                                                ></div>
                                                <div className={"flex flex-col"}>
                                                    <Button
                                                        type="button"
                                                        variant={"outline"}
                                                        disabled={field.disabled}
                                                        onBlur={field.onBlur}
                                                        ref={field.ref}
                                                        onClick={() => {
                                                            const newCover = createRandomCover()
                                                            form.setValue("cover", JSON.stringify(newCover), {
                                                                shouldDirty: true,
                                                                shouldTouch: true,
                                                                shouldValidate: true,
                                                            })
                                                        }}
                                                    >
                                                        <Icons.dice className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant={"outline"}
                                                        onClick={() =>
                                                            form.setValue(
                                                                "cover",
                                                                // @ts-expect-error not sure what's causing all the fields in the cover to have
                                                                // undefined included in their type, but it shouldn't happen so ignore error for now
                                                                form.formState.defaultValues.cover ?? createRandomCover(),
                                                                {
                                                                    shouldDirty: true,
                                                                    shouldTouch: true,
                                                                    shouldValidate: true,
                                                                }
                                                            )
                                                        }
                                                    >
                                                        <Undo className={"size-4"} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormDescription className="sr-only">This is the cover of the song.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex gap-1 flex-wrap items-end  h-fit">
                                <span className="text-xl font-[900] max-w-[80vw] break-words w-fit space-x-2">
                                    {currentValues.title}
                                    {currentValues.title.length > 0 && currentValues.source.length > 0 && (
                                        <span className="text-muted-foreground pl-2">by</span>
                                    )}
                                    <span className="break-words ">{currentValues.source}</span>
                                </span>
                            </div>
                        </div>
                        <Tabs defaultValue="manual" className="w-full border p-2 rounded-2xl">
                            <TabsList>
                                <TabsTrigger value="manual">Manual</TabsTrigger>
                                <TabsTrigger value="spotify" className="flex items-center gap-2">
                                    <Icons.spotify className="size-5" />
                                    Use Spotify
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="manual">
                                <ManualArtistTrack />
                            </TabsContent>
                            <TabsContent value="spotify">
                                <SpotifyArtistTrack />
                            </TabsContent>
                        </Tabs>
                    </div>
                    <AssociatedTrack />
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => <ContentFormFieldItem field={{ ...field }} changeIndicator={true} />}
                    />
                    {/* Disabled for now*/}
                    {/*<SearchForLyrics artist={currentValues.source} track={currentValues.title} />*/}
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </ScrollArea>
    )
}

function AssociatedTrack() {
    const form = useFormContext<CreateSongSchemaType>()
    const currentValues = form.getValues()

    if (!currentValues.spotifyUri) return null

    const removeAssociation = () => {
        form.setValue("spotifyCover", undefined, {
            shouldDirty: true,
        })

        form.setValue("spotifyUri", undefined, {
            shouldDirty: true,
        })
    }

    return (
        <div className="border p-2 rounded-lg space-y-4">
            <div className="flex gap-1">
                <Icons.spotify className="size-4" />
                <Label>Spotify song</Label>
                <Popover>
                    <PopoverTrigger>
                        <InfoCircledIcon />
                    </PopoverTrigger>
                    <PopoverContent>
                        <span className="font-semibold">What is this?</span>
                        <div>
                            <p className="text-muted-foreground pb-5 pt-2 text-sm ">
                                By linking this song to a Spotify track, you’ll be able to play it through the Spotify Web Player.
                                <br />
                                <br /> To use this feature, please enable the Spotify Web Player in your settings and ensure you have a
                                Spotify Premium account.
                            </p>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex items-center text-sm gap-3 ">
                {currentValues.spotifyCover && <img className="size-8 rounded-md" src={currentValues.spotifyCover} />}
                {currentValues.title}
            </div>
            <div className="text-sm text-muted-foreground">{currentValues.source}</div>
            <Button variant={"outline"} type="button" onClick={removeAssociation}>
                Remove <Trash className="size-4 ml-2" />
            </Button>
        </div>
    )
}

interface ManualArtistTrackProps {}

const ManualArtistTrack = forwardRef<HTMLInputElement, ManualArtistTrackProps>((_, ref) => {
    const form = useFormContext<CreateSongSchemaType>()

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mx-1">
            <FormField
                control={form.control}
                name={"title"}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="space-x-1">
                            <span>Title</span>
                            {field.value !== form.formState.defaultValues?.title ? "*" : ""}
                            <span className="text-xs text-muted-foreground">(Song name)</span>
                        </FormLabel>
                        <FormControl>
                            <Input {...field} ref={ref} />
                        </FormControl>
                        <FormDescription className="sr-only">This is the name of the song.</FormDescription>
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
                            {field.value !== form.formState.defaultValues?.source ? "*" : ""}
                            <span className="text-xs text-muted-foreground">(Artist)</span>
                        </FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormDescription className="sr-only">This is the name of the source of the song.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
})

const SpotifyArtistTrack = () => {
    const form = useFormContext<CreateSongSchemaType>()

    const handleSelectTrack = async (track: Track) => {
        const spotifyCover = track.album.images.length > 0 ? track.album.images[0].url : undefined
        form.setValue("title", track.name, {
            shouldDirty: true,
        })
        form.setValue("source", track.artists[0].name, {
            shouldDirty: true,
        })
        form.setValue("spotifyCover", spotifyCover, {
            shouldDirty: true,
        })
        form.setValue("spotifyUri", track.uri, {
            shouldDirty: true,
        })

        // Update the cover gradient to be based on the Spotify cover
        if (spotifyCover) {
            const palette = await getPalette(spotifyCover, 2, "rgbString", "anonymous")
            const coverFromSpotifyCover = createRandomCoverWithColours(palette)
            form.setValue("cover", JSON.stringify(coverFromSpotifyCover), {
                shouldDirty: true,
            })
        }
    }

    return (
        <div className="space-y-6 px-1">
            <SpotifyFeatureGuard>
                <SpotifyWebSDKProvider>
                    <FindSongUsingSpotify
                        onSelectSong={handleSelectTrack}
                        initialArtist={form.getValues("source")}
                        initialTitle={form.getValues("title")}
                    />

                    <FormField
                        control={form.control}
                        name="useSpotifyCover"
                        render={({ field }) => (
                            <FormItem className={"flex items-center  gap-2 "}>
                                <FormLabel>Use Spotify cover</FormLabel>
                                <FormControl>
                                    <div>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={(val) => {
                                                if (val === "indeterminate") return
                                                field.onChange(val)
                                            }}
                                            ref={field.ref}
                                            disabled={field.disabled}
                                            onBlur={field.onBlur}
                                        />
                                    </div>
                                </FormControl>
                                <FormDescription className="sr-only">This is the cover of the song.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </SpotifyWebSDKProvider>
            </SpotifyFeatureGuard>
        </div>
    )
}

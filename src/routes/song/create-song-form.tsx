import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ScrollArea } from "@/components/ui/scroll-area"

import { Input } from "@/components/ui/input"
import useCreateSong from "@/lib/hooks/use-create-song"
import { songSchema, SongSchemaType } from "@/lib/schemas/song"
import { cn } from "@/lib/utils"

import { zodResolver } from "@hookform/resolvers/zod"
import { forwardRef, useContext, useEffect, useMemo, useRef, useState } from "react"
import { useForm, useFormContext } from "react-hook-form"
import SongContentFormField from "./song-content-form-field"

import SearchForLyrics from "@/components/spotify/search/search-for-lyrics.tsx"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { coverAsStyle, createRandomCover, createRandomCoverWithColours, parseGeneratedCoverString } from "@/lib/gradient"
import { Track } from "@spotify/web-api-ts-sdk"
import { createContext } from "react"
import CreateSongFormSongAssociation from "./create-song-form-song-association"
import SpotifyWebSDKProvider from "@/components/spotify/providers/spotify-web-sdk-provider.tsx"
import FindSongUsingSpotify from "@/components/spotify/search/find-song-using-spotify.tsx"
import SpotifyFeatureGuard from "@/components/spotify/spotify-feature-guard.tsx"
import { getPalette } from "color-thief-react"
import { Label } from "@/components/ui/label.tsx"
import { Checkbox } from "@/components/ui/checkbox.tsx"
import { atomWithStorage } from "jotai/utils"
import { useAtom } from "jotai/index"

// TODO : this whole thing seems messy
// I think I need separate context from form for this because if the user uses spotify option I need to associate it with the spotify song
// (need access to name etc) because the user can still change the title and artist of the song
// Or maybe only allow the user to use either spotify or manual option, not both

interface SongAssociation {
    song: Track | null
    setSong: (value: Track | null) => void
}

const SongAssociationContext = createContext<SongAssociation | null>(null)

const isUseSpotifyCoverAtom = atomWithStorage("typer-create-song-form:isUseSpotifyCover", false)
const useIsUseSpotifyCover = () => useAtom(isUseSpotifyCoverAtom)

// TODO : Need to move this stuff out of here for hmr
export const useSongAssociation = () => {
    const context = useContext(SongAssociationContext)
    if (context == undefined) {
        throw new Error("useSongAssociation must be used within a SongAssociationProvider")
    }
    return context
}

export default function CreateSongForm({ onSuccess }: { onSuccess?: () => void }) {
    const createSong = useCreateSong()
    // TODO : can't do focus on input after submit for spotify like its in manual because it gets rerendered with through changing key
    const titleInputRef = useRef<HTMLInputElement>(null)
    const [songAssociation, setSongAssociation] = useState<Track | null>(null)
    const [isUseSpotifyCover] = useIsUseSpotifyCover()

    const [resetSignal, setResetSignal] = useState(false)

    const randomCoverGradient = useMemo(() => createRandomCover(), [])

    const form = useForm<SongSchemaType>({
        resolver: zodResolver(songSchema),
        defaultValues: {
            source: "",
            title: "",
            content: "",
            cover: JSON.stringify(randomCoverGradient),
            spotifyURI: "",
        },
    })

    async function onSubmit(values: SongSchemaType) {
        console.log(values)

        const song = {
            title: values.title,
            content: values.content.replace(/\[.*?]/g, "").trim(), // Removes [Verse 1] [Chorus] etc.
            source: values.source,
            cover: values.cover,
            spotifyUri: songAssociation?.uri,
            spotifyCover:
                isUseSpotifyCover && songAssociation && songAssociation.album.images.length > 0
                    ? songAssociation.album.images[0].url
                    : undefined,
        }

        const result = createSong(song)

        if (!result) return

        // It needs  to specify the object again because need to generate a new unique cover instead of the forms defaultValue for it
        form.reset({
            title: "",
            source: "",
            content: "",
            cover: JSON.stringify(createRandomCover()),
            spotifyURI: "",
        })

        setResetSignal((prev) => !prev)

        setSongAssociation(null)

        titleInputRef.current?.focus()

        if (onSuccess) onSuccess()
    }

    useEffect(() => {
        const updateFormCoverField = async () => {
            if (songAssociation && songAssociation.album.images.length > 0) {
                const palette = await getPalette(songAssociation.album.images[0].url, 2, "rgbString", "anonymous")

                const cover = JSON.stringify(createRandomCoverWithColours(palette))
                form.setValue("cover", cover)
            }
        }

        updateFormCoverField()
    }, [form, songAssociation])

    const [title, source] = form.watch(["title", "source"])
    return (
        <ScrollArea className="h-[100%] px-2 sm:px-6 md:px-12   overflow-hidden border-t ">
            <SongAssociationContext.Provider value={{ song: songAssociation, setSong: setSongAssociation }}>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8 sm:mb-2 mb-4">
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
                                                        className={cn("w-20 h-20 rounded-md relative overflow-hidden")}
                                                        style={coverAsStyle(parseGeneratedCoverString(field.value))}
                                                    >
                                                        {isUseSpotifyCover && songAssociation && songAssociation.album.images[0].url && (
                                                            <img
                                                                src={songAssociation.album.images[0].url}
                                                                alt={songAssociation.name + " album cover."}
                                                            />
                                                        )}
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant={"outline"}
                                                        onClick={() => form.setValue("cover", JSON.stringify(createRandomCover()))}
                                                    >
                                                        <Icons.dice className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormDescription className="sr-only">This is the cover of the song.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex gap-1 flex-wrap items-end  h-fit">
                                    <span className="text-xl font-[900] max-w-[80vw] break-words w-fit space-x-2">
                                        {title}
                                        {title.length > 0 && source.length > 0 && <span className="text-muted-foreground pl-2">by</span>}
                                        <span className="break-words ">{source}</span>
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
                                    <ManualArtistTrack ref={titleInputRef} />
                                </TabsContent>
                                <TabsContent value="spotify">
                                    <SpotifyArtistTrack />
                                </TabsContent>
                            </Tabs>
                        </div>
                        <CreateSongFormSongAssociation />
                        <SongContentFormField resetSignal={resetSignal} />
                        <SearchForLyrics artist={source} track={title} />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </SongAssociationContext.Provider>
        </ScrollArea>
    )
}

const SpotifyArtistTrack = () => {
    const form = useFormContext<SongSchemaType>()
    const { setSong } = useSongAssociation()
    const [isUseSpotifyCover, setIsUseSpotifyCover] = useIsUseSpotifyCover()

    const handleSelectTrack = (track: Track) => {
        form.setValue("title", track.name)
        form.setValue("source", track.artists[0].name)

        setSong(track)
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
                    <div className={"flex items-center gap-3"}>
                        <Label htmlFor={"use-spotify-cover-checkbox"}>Use Spotify cover</Label>
                        <Checkbox
                            id={"use-spotify-cover-checkbox"}
                            checked={isUseSpotifyCover}
                            onCheckedChange={(val) => {
                                if (val === "indeterminate") return

                                setIsUseSpotifyCover(val)
                            }}
                        />
                    </div>
                </SpotifyWebSDKProvider>
            </SpotifyFeatureGuard>
        </div>
    )
}

interface ManualArtistTrackProps {}

const ManualArtistTrack = forwardRef<HTMLInputElement, ManualArtistTrackProps>((_, ref) => {
    const form = useFormContext<SongSchemaType>()

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mx-1">
            <FormField
                control={form.control}
                name={"title"}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="space-x-1">
                            <span>Title</span>
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

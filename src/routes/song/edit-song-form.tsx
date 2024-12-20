import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { coverAsStyle, createRandomCover, parseGeneratedCoverString } from "@/lib/gradient"
import { songSchema, SongSchemaType } from "@/lib/schemas/song"
import { useSongStore } from "@/lib/store/song-store"
import { Song } from "@/lib/types"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import SongContentFormField from "./song-content-form-field"

export default function EditSongForm({ onSuccess, song }: { onSuccess?: () => void; song: Song }) {
    const songStore = useSongStore()
    const { toast } = useToast()
    const formRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()

    // TODO : Idk about this, must be a better way to rerender
    //  I think I had a way in stocks-veg
    const [, setContentRerender] = useState(false)
    const [, setRerenderChildren] = useState(false)

    const form = useForm<SongSchemaType>({
        resolver: zodResolver(songSchema),
        defaultValues: {
            source: song.source,
            title: song.title,
            content: song.content,
            cover: song.cover,
        },
    })

    function onSubmit(values: SongSchemaType) {
        console.log(values)

        let completion = song.completion
        let record = { accuracy: song.record.accuracy, wpm: song.record.wpm }

        if (values.content != song.content) {
            completion = 0
            record = { accuracy: 0, wpm: 0 }
        }

        // TODO : I don't like this icl
        songStore.editSong({
            id: song.id,
            title: values.title,
            content: values.content,
            source: values.source,
            completion: completion,
            cover: values.cover,
            record: record,
            createdAt: song.createdAt,
            lastModifiedAt: Date.now(),
        })

        form.reset()
        toast({
            title: "Successfully edited your song.",
            description: `${values.title} - ${values.source}`,
            variant: "success",
            action: (
                <Link to={`/songs/${song.id}`}>
                    <Button variant={"outline"}>View song</Button>
                </Link>
            ),
        })

        formRef.current?.focus()
        if (onSuccess) onSuccess()

        setRerenderChildren(true)
    }

    const handleContentChange = () => {
        setContentRerender((prev) => !prev)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
                <div className="flex gap-8 items-end flex-wrap w-full">
                    <FormField
                        control={form.control}
                        name="cover"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cover {field.value != song.cover ? <span className="text-primary">*</span> : ""}</FormLabel>
                                <FormControl>
                                    <div className="flex gap-2 items-end">
                                        <div
                                            className={cn("w-20 h-20 rounded-md")}
                                            style={coverAsStyle(parseGeneratedCoverString(field.value))}
                                        ></div>
                                        <Button
                                            type="button"
                                            variant={"outline"}
                                            onClick={() => {
                                                form.setValue("cover", JSON.stringify(createRandomCover()))
                                            }}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mx-1">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Title
                                        {field.value != song.title ? <span className="text-primary">*</span> : ""}
                                        <span className="text-xs text-muted-foreground"> (Song name)</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} ref={formRef} />
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
                                    <FormLabel>
                                        Source
                                        {field.value != song.source ? <span className="text-primary">*</span> : ""}
                                        <span className="text-xs text-muted-foreground"> (Artist)</span>
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
                </div>

                <SongContentFormField initialVal={song.content} onContentChange={handleContentChange} changeIndicator />

                <div className="flex justify-between pt-8">
                    <Button
                        type="button"
                        variant={"ghost"}
                        onClick={() => {
                            navigate("/songs")
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
    )
}

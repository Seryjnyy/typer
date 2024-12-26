import { z } from "zod"

// Regex for validating "rgb(n1, n2, n3)" format
const rgbColorRegex = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/

const coverSchema = z
    .object({
        type: z.literal("linear-gradient"),
        dir: z.number(),
        colours: z.array(
            z.string().refine(
                (color) => {
                    const match = color.match(rgbColorRegex)
                    if (!match) return false
                    // Extract RGB values and ensure each is between 0 and 255
                    const [r, g, b] = match.slice(1).map(Number)
                    return [r, g, b].every((value) => value >= 0 && value <= 255)
                },
                {
                    message: "Colours must be in the format 'rgb(n, n, n)' with n between 0 and 255",
                }
            )
        ),
    })
    .optional()

export const songSchema = z.object({
    title: z.string().min(1, "Title must be at least 1 character.").max(150).regex(/\S+/, {
        message: "Title cannot be just whitespace characters",
    }),
    source: z.string().min(1, "Source must be at least 1 character.").max(150).regex(/\S+/, {
        message: "Source cannot be just whitespace characters",
    }),
    content: z.string().min(1, "Content must be at least 1 character.").max(8000).regex(/\S+/, {
        message: "Content cannot be just whitespace characters",
    }),
    cover: z.preprocess((data) => {
        if (typeof data !== "string") return undefined
        const parsedCover = coverSchema.safeParse(JSON.parse(data))
        return parsedCover.success ? parsedCover.data : undefined
    }, coverSchema),
    completion: z.number().int().nonnegative().optional().catch(undefined),
    record: z
        .object({
            wpm: z.number().nonnegative(),
            accuracy: z.number().nonnegative().max(100),
        })
        .optional()
        .catch(undefined),
    createdAt: z
        .number()
        .int()
        .nonnegative({
            message: "Timestamp must be a non negative number.",
        })
        .refine(
            (timestamp) => {
                const date = new Date(timestamp)
                return date.getTime() > 0 && !isNaN(date.getTime())
            },
            { message: "Invalid timestamp" }
        )
        .optional()
        .catch(undefined),
    spotifyUri: z
        .string()
        .regex(/^spotify:track:[a-zA-Z0-9]{22}$/, {
            message: "Invalid Spotify URI format",
        })
        .optional()
        .catch(undefined),
    spotifyCover: z
        .string()
        .url()
        .regex(/^https:\/\/[a-zA-Z0-9.]*scdn\.co\/image\/[a-zA-Z0-9]{40,}$/, {
            message: "Invalid Spotify cover URL format",
        })
        .optional()
        .catch(undefined),
})
export const importSongSchema = songSchema
export type ImportSongSchemaType = z.infer<typeof importSongSchema>

export const createSongSchema = songSchema.pick({ title: true, source: true, content: true, spotifyCover: true, spotifyUri: true }).extend({
    useSpotifyCover: z.boolean(),
    cover: z.string(),
    id: z.string().optional(),
})

export type CreateSongSchemaType = z.infer<typeof createSongSchema>

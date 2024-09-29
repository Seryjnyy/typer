import { z } from "zod";

export const playlistSchema = z.object({
    title: z
        .string()
        .min(1, "Title must be at least 1 character.")
        .max(150, "Title must be less than 150 characters.")
        .regex(/\S+/, {
            message: "Title cannot be just whitespace characters.",
        }),
});

export type createPlaylistSchemaType = z.infer<typeof playlistSchema>;

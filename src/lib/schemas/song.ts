import { z } from "zod";

export const songSchema = z.object({
    source: z
        .string()
        .min(1, "Source name must be at least 1 character.")
        .max(150, "Source name must be less than 150 characters."),
    title: z
        .string()
        .min(1, "Title must be at least 1 character.")
        .max(150, "Title must be less than 150 characters."),
    content: z.string().min(1, "Content must be at least 1 character."),
    // .max(8000, "Content must be less than 8000 characters."),
    cover: z.string(),
});

export type songSchemaType = z.infer<typeof songSchema>;

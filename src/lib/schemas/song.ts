import { z } from "zod";

export const songSchema = z.object({
    source: z
        .string()
        .min(1, "Source name must be at least 1 character.")
        .max(150, "Source name must be less than 150 characters.")
        .regex(/\S+/, {
            message: "Source cannot be just whitespace characters.",
        }),
    title: z
        .string()
        .min(1, "Title must be at least 1 character.")
        .max(150, "Title must be less than 150 characters.")
        .regex(/\S+/, {
            message: "Title cannot be just whitespace characters.",
        }),

    content: z
        .string()
        .min(1, "Content must be at least 1 character.")
        .max(8000, "Content must be less than 8000 characters.")
        .regex(/\S+/, {
            message: "Content cannot be just whitespace characters.",
        }),
    cover: z.string(),
});

export type songSchemaType = z.infer<typeof songSchema>;

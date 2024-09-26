import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import useCreateSong from "@/lib/hooks/use-create-song";
import { useState } from "react";
import { Link } from "react-router-dom";

import { z } from "zod";
import { gradientOptions } from "../utils";
import { usePreferenceStore } from "../store/preferences-store";

// Dynamically create the regex from the allowed options
const dirPattern = gradientOptions.directions.join("|");
const colourPattern = gradientOptions.colours.join("|");

const coverRegexString = `^bg-gradient-to-(${dirPattern}) from-(${colourPattern})-(\\d{3}) to-(${colourPattern})-(\\d{3})$`;
const coverRegex = new RegExp(coverRegexString);

const importSongSchema = z.object({
    title: z.string().min(1).max(150).regex(/\S+/, {
        message: "Content cannot be just whitespace characters",
    }),
    source: z.string().min(1).max(150).regex(/\S+/, {
        message: "Content cannot be just whitespace characters",
    }),
    content: z.string().min(1).max(8000).regex(/\S+/, {
        message: "Content cannot be just whitespace characters",
    }),
    cover: z
        .string()
        .regex(coverRegex, { message: "Invalid cover format" })
        .refine((cover) => {
            const match = cover.match(coverRegex);

            // Regex doesn't match
            if (!match) {
                return false;
            }

            const [, dir, fromColour, fromColourNum, toColour, toColourNum] =
                match;

            const isValidDir = gradientOptions.directions.includes(dir);
            const isValidFromColour =
                gradientOptions.colours.includes(fromColour);
            const isValidToColour = gradientOptions.colours.includes(toColour);
            const isValidFromColourNum = gradientOptions.steps.includes(
                Number(fromColourNum)
            );
            const isValidToColourNum = gradientOptions.steps.includes(
                Number(toColourNum)
            );

            return (
                isValidDir &&
                isValidFromColour &&
                isValidToColour &&
                isValidFromColourNum &&
                isValidToColourNum
            );
        })
        .optional()
        .catch(undefined),
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
                const date = new Date(timestamp);
                return date.getTime() > 0 && !isNaN(date.getTime());
            },
            { message: "Invalid timestamp" }
        )
        .optional()
        .catch(undefined),
});

// TODO : There is no max value, this shit could blow up, idk what max to set
const jsonSchema = z.object({
    songs: z.array(z.any()),
});

// Not sure if should be a hook but its taking up a lot of space

export default function useImportSongs() {
    const importSongPreferences = usePreferenceStore.use.importSongs();

    const createSong = useCreateSong();
    const [imported, setImported] = useState("");
    const [error, setError] = useState("");

    const processJSONfile = async (file: File) => {
        if (file.type != "application/json") {
            console.error("Incorrect file format");
            return;
        }

        const text = await file.text();

        try {
            const parsed = JSON.parse(text);

            const result = jsonSchema.safeParse(parsed);

            if (result.error || !result.success) {
                console.error("Failed to parse JSON.");
                return;
            }

            const parsedSongs = result.data.songs.map((song: any) => {
                const songParseResult = importSongSchema.safeParse(song);
                if (!songParseResult.success) {
                    console.error(
                        "Invalid song found:",
                        songParseResult.error.errors
                    );

                    return null;
                }
                return songParseResult.data;
            });

            const validSongs = parsedSongs.filter(Boolean);
            console.log(
                `Successfully parsed ${validSongs.length}/${parsedSongs.length} songs.`
            );

            validSongs.forEach((song) => {
                // Check with import preferences
                if (song) {
                    createSong({
                        ...song,
                        cover: importSongPreferences.cover
                            ? song.cover
                            : undefined,
                        completion: importSongPreferences.completion
                            ? song.completion
                            : undefined,
                        createdAt: importSongPreferences.createdAt
                            ? song.createdAt
                            : undefined,
                        record: importSongPreferences.record
                            ? song.record
                            : undefined,
                    });
                }
            });

            console.log(validSongs);

            toast({
                title: `Successfully imported songs.`,
                description:
                    validSongs.length == parsedSongs.length
                        ? "All songs imported."
                        : `Couldn't import some songs. (${validSongs.length}/${parsedSongs.length})`,
                variant: "success",
                action: (
                    <Link to={`/songs`}>
                        <Button variant={"outline"}>View songs list</Button>
                    </Link>
                ),
            });

            setImported(`${validSongs.length}/${parsedSongs.length}`);
        } catch (error) {
            // TODO : not implemented properly yet
            // TODO : better error messages

            if (error instanceof SyntaxError) {
                setError(JSON.stringify(error.message));
            } else {
                setError(
                    "Something went wrong. Please check the JSON file and try again."
                );
            }

            console.error(error);
            return;
        }
    };

    const clear = () => {
        setImported("");
        setError("");
    };

    return { processJSONfile, imported, error, clear };
}

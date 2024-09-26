import React from "react";
import { useSongStore } from "../store/song-store";
import { Song } from "../types";
import { generateGradient, seeSizeOfStringInLocalStorage } from "../utils";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// TODO : idk about this, seems very messy
// also everything is all over the place, data layer business layer typa thing does not exist in this project :/
export default function useCreateSong() {
    const addSong = useSongStore.use.addSong();
    return (
        {
            title,
            content,
            source,
            completion,
            cover,
            createdAt,
            id,
            lastModifiedAt,
            record,
        }: {
            title: string;
            source: string;
            content: string;
            cover?: string;
            completion?: number;
            createdAt?: number;
            lastModifiedAt?: number;
            record?: { wpm: number; accuracy: number };
            id?: string;
        },
        successToast = false
    ) => {
        const song = {
            title,
            source,
            content,
            cover: cover ? cover : generateGradient(),
            completion: completion ? completion : 0,
            createdAt: createdAt ? createdAt : Date.now(),
            lastModifiedAt: lastModifiedAt ? lastModifiedAt : Date.now(),
            record: record ? record : { wpm: 0, accuracy: 0 },
            id: id ? id : uuidv4(),
        };
        try {
            addSong(song);

            if (successToast) {
                toast({
                    title: "Successfully added your song.",
                    description: `${song.title} - ${song.source}`,
                    variant: "success",
                    action: (
                        <Link to={`/songs/${song.id}`}>
                            <Button variant={"outline"}>View song</Button>
                        </Link>
                    ),
                });
            }
            return true;
        } catch (e) {
            console.error("oh no this is not going to work");
            console.log(
                "SIZE::::::",
                seeSizeOfStringInLocalStorage(JSON.stringify(song))
            );
            toast({
                title: "Failed to add song.",
                description: `It seems like storage is full or this song is too long. ${
                    JSON.stringify(localStorage).length
                }storage size ${JSON.stringify(song).length}`,
                variant: "destructive",
            });
            return false;
        }
    };
}

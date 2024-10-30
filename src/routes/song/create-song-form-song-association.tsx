import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useSongAssociation } from "./create-song-form";

import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Trash } from "lucide-react";

export default function CreateSongFormSongAssociation() {
    const { song, setSong } = useSongAssociation();

    if (!song) return null;

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
                                By linking this song to a Spotify track, you’ll
                                be able to play it through the Spotify Web
                                Player.
                                <br />
                                <br /> To use this feature, please enable the
                                Spotify Web Player in your settings and ensure
                                you have a Spotify Premium account.
                            </p>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex items-center text-sm gap-3 ">
                {song.album.images.length > 0 && (
                    <img
                        className="size-8 rounded-md"
                        src={song.album.images[0].url}
                    />
                )}
                {song.name}
            </div>
            <div className="text-sm text-muted-foreground">
                {song.artists.map((artist) => artist.name).join(", ")}
            </div>
            <Button
                variant={"outline"}
                type="button"
                onClick={() => setSong(null)}
            >
                Remove <Trash className="size-4 ml-2" />
            </Button>
        </div>
    );
}

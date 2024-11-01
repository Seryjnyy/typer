import { Button } from "@/components/ui/button";

import { InfoCircledIcon } from "@radix-ui/react-icons";
import { ExternalLink } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export default function SearchForLyrics({
    artist,
    track,
}: {
    artist: string;
    track: string;
}) {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
        `${track} by ${artist} lyrics`
    )}`;

    const isArtist = artist.length > 0;
    const isTrack = track.length > 0;

    return (
        <div className="flex items-center gap-2">
            {!isArtist && !isTrack && (
                <Button
                    variant={"secondary"}
                    type="button"
                    disabled={!isArtist && !isTrack}
                >
                    Search for lyrics <ExternalLink className="size-4 ml-2" />
                </Button>
            )}

            {(isArtist || isTrack) && (
                <a href={searchUrl} target="#">
                    <Button variant={"secondary"} type="button">
                        Search for lyrics{" "}
                        <ExternalLink className="size-4 ml-2" />
                    </Button>
                </a>
            )}
            <Info />
        </div>
    );
}

const Info = () => {
    return (
        <div className="inline">
            <Popover>
                <PopoverTrigger>
                    <InfoCircledIcon />
                </PopoverTrigger>
                <PopoverContent>
                    <span className="font-semibold">
                        Why not fetch it for me?
                    </span>
                    <div>
                        <p className="text-muted-foreground pb-5 pt-2 text-sm ">
                            Lyrics are tricky to get because of licensing and
                            copyright restrictions. I'm trying to find a way to
                            fetch them for you.
                            <br />
                            <br />
                            For now, it will have to be a Google search.
                        </p>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};

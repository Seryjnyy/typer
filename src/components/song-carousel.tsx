import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { Song } from "@/lib/types";
import { PlusIcon } from "@radix-ui/react-icons";
import AutoScroll from "embla-carousel-auto-scroll";
import { Button } from "./ui/button";
import { SongBanner, SongDetail, SongHeader } from "./ui/song-header";
import { useQueueStore } from "@/lib/store/queue-store";

interface SongCarouselProps {
    songs: Song[];
}

export default function SongCarousel({ songs }: SongCarouselProps) {
    const enqueue = useQueueStore.use.enqueue();

    const onEnqueueAll = () => {
        songs.forEach((song) => enqueue(song.id));
    };

    const onEnqueue = (song: Song) => {
        enqueue(song.id);
    };

    return (
        <Carousel
            className={"w-[calc(100vw-15rem)]   h-fit  rounded-md"}
            opts={{ loop: true }}
            plugins={[
                AutoScroll({
                    speed: 0.5,
                    stopOnMouseEnter: false,
                    stopOnInteraction: false,
                }),
            ]}
        >
            <CarouselContent className="h-full ">
                {songs.map((song) => (
                    <CarouselItem className="md:basis-1/2 lg:basis-1/3 h-full  px-8">
                        <div className="bg-card flex justify-between rounded-md">
                            <SongHeader className="p-3  w-fit">
                                <SongBanner size={"large"} song={song} />
                                <SongDetail
                                    length={"extra-long"}
                                    song={song}
                                    isCurrent={false}
                                />
                            </SongHeader>
                            <Button
                                variant={"ghost"}
                                size={"sm"}
                                className="ml-3 self-end"
                                onClick={() => onEnqueue(song)}
                            >
                                Enqueue
                            </Button>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <Button
                className="space-x-2 mt-2"
                variant={"ghost"}
                size={"sm"}
                onClick={onEnqueueAll}
            >
                <PlusIcon /> <span className="text-xs">Enqueue all </span>
            </Button>
        </Carousel>
    );
}

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
    const setCurrent = useQueueStore.use.setCurrent();

    const onEnqueueAll = () => {
        songs.forEach((song) => enqueue(song.id));
        if (songs.length > 0) {
            setCurrent(songs[0].id);
        }
    };

    const onEnqueue = (song: Song) => {
        enqueue(song.id, false);
    };

    return (
        <Carousel
            className={"w-[100%]  h-fit  overflow-hidden"}
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
                    <CarouselItem
                        className="md:basis-2/3 xl:basis-1/3 h-full  px-2 sm:px-8 "
                        key={song.id}
                    >
                        <div className="bg-card flex  rounded-md relative">
                            <SongHeader className="p-3  w-fit">
                                <SongBanner
                                    size={"lg"}
                                    song={song}
                                    playButton
                                />
                                <SongDetail
                                    length={"extra-long"}
                                    song={song}
                                    isCurrent={false}
                                />
                            </SongHeader>
                            <div className="absolute bottom-0 right-0">
                                <Button
                                    variant={"ghost"}
                                    size={"sm"}
                                    onClick={() => onEnqueue(song)}
                                >
                                    Enqueue
                                </Button>
                            </div>
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

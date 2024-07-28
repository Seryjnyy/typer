import {
  Pencil1Icon,
  PlayIcon,
  PlusIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { Button } from "./components/ui/button";
import { ScrollArea } from "./components/ui/scroll-area";
import { useQueueStore } from "./lib/store/queue-store";
import { useSongStore } from "./lib/store/song-store";
import { useSongs } from "./lib/use-songs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AllSongs = () => {
  const songStore = useSongStore();
  const queue = useQueueStore();

  const onAddToQueue = (songId: string) => {
    queue.enqueue(songId);
  };

  const onAddNext = (songId: string) => {};

  return (
    <div>
      <h2 className="p-2 border w-fit">{songStore.songs.length} songs</h2>
      <ScrollArea className="w-full bg-blue-200 h-[80vh]">
        {/* <Button
        onClick={() =>
          songStore.addSong({
            id: "test" + Date.now().toString(),
            content: "test" + Date.now().toString(),
            source: "test" + Date.now().toString(),
            title: "test" + Date.now().toString(),
          })
        }
      >
        Add
      </Button> */}
        {/* <Button>Add all to queue</Button> */}
        <div className="bg-red-200 h-full">
          {songStore.songs.map((song) => (
            <div className="border p-4  group" key={song.id}>
              <div className="flex flex-col">
                <span>{song.title}</span>
                <span className="text-muted-foreground text-sm">
                  {song.source}
                </span>
              </div>

              <div className="flex justify-between">
                <div className="flex gap-2">
                  <Button size={"icon"}>
                    <PlayIcon className="group-hover:text-blue-400" />
                  </Button>
                  <div>
                    <Button
                      className="space-x-2"
                      onClick={() => onAddToQueue(song.id)}
                    >
                      <PlusIcon />
                      <span> Queue</span>
                    </Button>
                    <Button className="space-x-2">
                      <PlusIcon />
                      <span> Next</span>
                    </Button>
                  </div>
                </div>

                <div>
                  <Button className="space-x-2">
                    <PlusIcon />
                    <span> Playlist</span>
                  </Button>
                  <Button>
                    <Pencil1Icon />
                  </Button>
                  <Button onClick={() => songStore.removeSong(song.id)}>
                    <TrashIcon />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default function SongsList() {
  const songStore = useSongStore();
  return (
    <Tabs defaultValue="all-songs" className="p-8 h-full">
      <TabsList>
        <TabsTrigger value="all-songs">All songs</TabsTrigger>
        <TabsTrigger value="playlists">Playlists</TabsTrigger>
        <TabsTrigger value="add-song">Add song</TabsTrigger>
      </TabsList>
      <TabsContent value="all-songs" className="h-full">
        <AllSongs />
      </TabsContent>
      <TabsContent value="playlists">playlists</TabsContent>
      <TabsContent value="add-song">add song</TabsContent>
    </Tabs>
  );
}

import { useQueueStore } from "@/lib/store/queue-store";
import { useLocation, useNavigate } from "react-router-dom";

export default function usePlaySong() {
    const navigate = useNavigate();
    const location = useLocation();

    const songs = useQueueStore.use.songs();
    const enqueue = useQueueStore.use.enqueue();
    const setCurrent = useQueueStore.use.setCurrent();

    return (songId: string) => {
        if (!songs.includes(songId)) {
            // TODO : Should enqueue the song at the top of the queue if no current
            // Otherwise enqueue after current
            enqueue(songId, true);
        } else {
            setCurrent(songId);
        }

        if (location.pathname != "/") {
            navigate("/");
        }
    };
}

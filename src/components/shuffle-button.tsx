import { useQueueStore } from "@/lib/store/queue-store";
import { shuffleArray } from "@/lib/utils";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Button, ButtonProps } from "./ui/button";

interface ShuffleButtonProps extends ButtonProps {}

export default function ShuffleButton({
    children,
    ...props
}: ShuffleButtonProps) {
    const songs = useQueueStore.use.songs();
    const setSongs = useQueueStore.use.setSongs();

    const onShuffle = () => {
        setSongs(shuffleArray(songs));
    };

    return (
        <Button {...props} onClick={onShuffle}>
            {children ? children : <ReloadIcon />}
        </Button>
    );
}

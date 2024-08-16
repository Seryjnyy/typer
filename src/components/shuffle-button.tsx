import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQueueStore } from "@/lib/store/queue-store";
import { shuffleArray } from "@/lib/utils";
import { ShuffleIcon } from "@radix-ui/react-icons";
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
        <Tooltip>
            <TooltipTrigger asChild>
                <Button {...props} onClick={onShuffle}>
                    {children ? children : <ShuffleIcon />}
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Shuffle</p>
            </TooltipContent>
        </Tooltip>
    );
}

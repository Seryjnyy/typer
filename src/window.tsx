import { ModeToggle } from "./components/mode-toggle";
import { useUiStateStore } from "./lib/store/ui-state-store";

import SongsWindow from "./songs-window";
import TyperWindow from "./typer-window";

import { ScrollArea } from "@/components/ui/scroll-area";

export default function Window() {
    const currentWindow = useUiStateStore.use.currentWindow();

    if (currentWindow == "typer") {
        // return (
        //     <div className="h-full w-full">
        //         <div className="w-full h-full">
        //             <TyperWindow />
        //         </div>
        //     </div>
        // );

        return (
            <div className="relative h-full w-full overflow-y-hidden">
                <ScrollArea className="h-full  relative">
                    <div className="w-full h-full ">
                        <TyperWindow />
                    </div>
                </ScrollArea>
            </div>
        );
    }

    if (currentWindow == "song_list") {
        return <SongsWindow />;
    }

    if (currentWindow == "settings") {
        return (
            <div className="w-full h-full ">
                <ModeToggle />
            </div>
        );
    }

    return <></>;
}

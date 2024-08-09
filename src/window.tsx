import { useUiStateStore } from "./lib/store/ui-state-store";
import LineTest from "./line-test";
import SongsWindow from "./songs-window";
import TyperWindow from "./typer-window";

export default function Window() {
    const currentWindow = useUiStateStore.use.currentWindow();

    if (currentWindow == "typer") {
        return (
            <div className="relative overflow-y-scroll h-full w-full">
                <div className="absolute top-0 right-0 w-full h-full">
                    {/* <TyperWindow /> */}
                    <LineTest />
                </div>
            </div>
        );
    }

    if (currentWindow == "song_list") {
        return <SongsWindow />;
    }

    if (currentWindow == "settings") {
        return <div className="w-full h-full bg-lime-300">settings</div>;
    }

    return <></>;
}

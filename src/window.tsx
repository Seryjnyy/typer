import { useUiStateStore } from "./lib/store/ui-state-store";
import SongsWindow from "./songs-window";
import TyperWindow from "./typer-window";

export default function Window() {
  const currentWindow = useUiStateStore.use.currentWindow();

  if (currentWindow == "typer") {
    return <TyperWindow />;
  }

  if (currentWindow == "song_list") {
    return <SongsWindow />;
  }

  if (currentWindow == "settings") {
    return <div className="w-full h-full bg-lime-300">settings</div>;
  }

  return <></>;
}

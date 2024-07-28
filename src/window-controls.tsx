import { FileTextIcon, GearIcon, KeyboardIcon } from "@radix-ui/react-icons";
import { Button } from "./components/ui/button";
import { useUiStateStore } from "./lib/store/ui-state-store";
import { Windows } from "./lib/types";
import { ReactNode } from "react";
export default function WindowControls() {
  const currentWindow = useUiStateStore.use.currentWindow();
  const setCurrentWindow = useUiStateStore.use.setCurrentWindow();

  const options: { id: Windows; icon: ReactNode }[] = [
    { id: "typer", icon: <KeyboardIcon /> },
    { id: "song_list", icon: <FileTextIcon /> },
    { id: "settings", icon: <GearIcon /> },
  ];

  const onChangeWindow = (id: Windows) => {
    setCurrentWindow(id);
  };

  return (
    <div>
      {options.map((option) => (
        <Button
          size={"icon"}
          key={option.id}
          variant={currentWindow == option.id ? "default" : "secondary"}
          onClick={() => onChangeWindow(option.id)}
        >
          {option.icon}
        </Button>
      ))}
    </div>
  );
}

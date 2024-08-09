import { create } from "zustand";

import { Windows } from "../types";
import { createSelectors } from "./create-selectors";

type Store = {
    focus: boolean;
    setFocus: (focus: boolean) => void;
    queueWindowOpen: boolean;
    setQueueWindowOpen: (open: boolean) => void;
    currentWindow: Windows;
    setCurrentWindow: (newCurrentWindow: Windows) => void;
};

const useUiStateStoreBase = create<Store>((set) => ({
    queueWindowOpen: true,
    setQueueWindowOpen: (open) => set(() => ({ queueWindowOpen: open })),
    currentWindow: "typer",
    setCurrentWindow: (newCurrentWindow) =>
        set(() => ({ currentWindow: newCurrentWindow })),
    focus: false,
    setFocus: (focus) => set(() => ({ focus: focus })),
}));

const useUiStateStore = createSelectors(useUiStateStoreBase);

export { useUiStateStore };

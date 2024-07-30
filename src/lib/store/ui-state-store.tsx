import { create } from "zustand";

import { Windows } from "../types";
import { createSelectors } from "./create-selectors";

type Store = {
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
}));

const useUiStateStore = createSelectors(useUiStateStoreBase);

export { useUiStateStore };

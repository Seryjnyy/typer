import { create } from "zustand";

import { Windows } from "../types";
import { createSelectors } from "./create-selectors";

type Store = {
  currentWindow: Windows;
  setCurrentWindow: (newCurrentWindow: Windows) => void;
};

const useUiStateStoreBase = create<Store>((set) => ({
  currentWindow: "typer",
  setCurrentWindow: (newCurrentWindow) =>
    set(() => ({ currentWindow: newCurrentWindow })),
}));

const useUiStateStore = createSelectors(useUiStateStoreBase);

export { useUiStateStore };

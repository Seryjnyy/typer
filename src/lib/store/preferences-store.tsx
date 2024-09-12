import { create } from "zustand";

import { Windows } from "../types";
import { createSelectors } from "./create-selectors";
import { persist, createJSONStorage } from "zustand/middleware";

export type TyperTextDisplay = "cylinder" | "flat";
export type QueueStorage = "localStorage" | "sessionStorage";

// const PreferenceStoreName = "typer-preferences-storage";

type State = {
    typerTextDisplay: TyperTextDisplay;
    queueStorage: QueueStorage;
};

type Actions = {
    setTyperTextDisplay: (val: TyperTextDisplay) => void;
    setQueueStorage: (val: QueueStorage) => void;
};

const defaults: State = {
    typerTextDisplay: "cylinder",
    queueStorage: "localStorage",
};

const usePreferenceStoreBase = create<State & Actions>()(
    persist(
        (set, get) => ({
            ...defaults,
            setTyperTextDisplay: (val: TyperTextDisplay) =>
                set(() => {
                    return { typerTextDisplay: val };
                }),
            setQueueStorage: (val: QueueStorage) =>
                set(() => {
                    return { queueStorage: val };
                }),
        }),
        {
            name: "typer-preferences-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

const usePreferenceStore = createSelectors(usePreferenceStoreBase);

export { usePreferenceStore };

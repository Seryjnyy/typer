import { create } from "zustand";

import { Windows } from "../types";
import { createSelectors } from "./create-selectors";
import { persist, createJSONStorage } from "zustand/middleware";

export type TyperTextDisplay = "cylinder" | "flat";

type State = {
    typerTextDisplay: TyperTextDisplay;
};

type Actions = {
    setTyperTextDisplay: (val: TyperTextDisplay) => void;
};

const defaults: State = {
    typerTextDisplay: "cylinder",
};

const usePreferenceStoreBase = create<State & Actions>()(
    persist(
        (set, get) => ({
            ...defaults,
            setTyperTextDisplay: (val: TyperTextDisplay) =>
                set(() => {
                    return { typerTextDisplay: val };
                }),
        }),
        {
            name: "typer-preferences-storage",
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);

const usePreferenceStore = createSelectors(usePreferenceStoreBase);

export { usePreferenceStore };

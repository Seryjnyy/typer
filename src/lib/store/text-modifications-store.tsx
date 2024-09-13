import { create } from "zustand";

import { Windows } from "../types";
import { createSelectors } from "./create-selectors";
import { persist, createJSONStorage } from "zustand/middleware";

// TODO : I don't know if this should be a global store
// TODO : Idk if storing the settings that make it harder here makes sense :/
const TextModificationStoreName = "typer-text-modifications-storage";

export type TextModificationOptions = {
    letterCase: "normal" | "upper" | "lower";
    punctuation: "normal" | "removed";
    numbers: "normal" | "removed";
};

export type HarderOptions = {
    cantSeeAhead: boolean;
    cantSeeCurrent: boolean;
    cantSeeUnderlines: boolean;
};

type State = {
    textModifications: TextModificationOptions;
    harderOptions: HarderOptions;
};

type Actions = {
    setTextModifications: (val: TextModificationOptions) => void;
    setHarderOptions: (val: HarderOptions) => void;
    resetTextModifications: () => void;
    resetHarderOptions: () => void;
};

const defaults: State = {
    textModifications: {
        letterCase: "normal",
        punctuation: "normal",
        numbers: "normal",
    },
    harderOptions: {
        cantSeeAhead: false,
        cantSeeCurrent: false,
        cantSeeUnderlines: false,
    },
};

const useTextModificationsStoreBase = create<State & Actions>()(
    persist(
        (set, get) => ({
            ...defaults,
            setTextModifications: (val: TextModificationOptions) =>
                set(() => {
                    return { textModifications: val };
                }),
            setHarderOptions: (val: HarderOptions) =>
                set(() => {
                    return { harderOptions: val };
                }),
            resetHarderOptions: () =>
                set(() => {
                    return { harderOptions: defaults.harderOptions };
                }),
            resetTextModifications: () =>
                set(() => {
                    return { textModifications: defaults.textModifications };
                }),
        }),
        {
            name: TextModificationStoreName,
            storage: createJSONStorage(() => localStorage),
        }
    )
);

const useTextModificationsStore = createSelectors(
    useTextModificationsStoreBase
);

export { useTextModificationsStore };

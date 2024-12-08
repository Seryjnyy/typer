import { create } from "zustand"

import { createJSONStorage, persist } from "zustand/middleware"
import { createSelectors } from "./create-selectors"

type Store = {
    focus: boolean
    setFocus: (focus: boolean) => void
    queueWindowOpen: boolean
    setQueueWindowOpen: (open: boolean) => void
}

const useUiStateStoreBase = create<Store>()(
    persist(
        (set) => ({
            queueWindowOpen: true,
            setQueueWindowOpen: (open) => set(() => ({ queueWindowOpen: open })),
            currentWindow: "typer",
            focus: false,
            setFocus: (focus) => set(() => ({ focus: focus })),
        }),
        {
            name: "typer-ui-state",
            storage: createJSONStorage(() => sessionStorage),
        }
    )
)

const useUiStateStore = createSelectors(useUiStateStoreBase)

export { useUiStateStore }

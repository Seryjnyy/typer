import { useHotkeys } from "react-hotkeys-hook"

export function useTyperShortcuts({ onShortcut }: { onShortcut?: () => void }) {
    useHotkeys(
        "esc",
        () => {
            onShortcut?.()
        },
        {
            enableOnFormTags: true,
        }
    )
}

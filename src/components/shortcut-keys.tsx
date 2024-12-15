import { Shortcut } from "@/lib/store/shortcuts-store.ts"
import { formatHotKeys } from "@/lib/utils.ts"

function ShortcutKeys({ shortcut }: { shortcut: Shortcut | undefined | null }) {
    if (!shortcut) return null

    if (!shortcut.enabled) return null
    return <>{`(${formatHotKeys(shortcut.hotkeys)})`}</>
}

export default ShortcutKeys

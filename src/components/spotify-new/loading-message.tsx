import { Loader2 } from "lucide-react"

function LoadingMessage() {
    return (
        <div className={"text-muted-foreground flex items-center gap-2"}>
            <Loader2 className={"animate-spin"} /> loading...
        </div>
    )
}

export default LoadingMessage

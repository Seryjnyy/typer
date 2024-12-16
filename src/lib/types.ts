// https://stackoverflow.com/a/61108377
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

export type Song = {
    id: string
    title: string
    source: string
    content: string
    cover: string
    completion: number
    record: {
        accuracy: number
        wpm: number
    }
    createdAt: number
    lastModifiedAt: number
    spotifyUri?: string
    spotifyCover?: string
}

export type Order = "asc" | "desc"
export type ListStyle = "compact" | "list"
export type SortBy = "title" | "source" | "completions" | "length" | "created" | "modified"

export type GeneratedCover = {
    type: "linear-gradient"
    dir: number
    colours: string[]
}

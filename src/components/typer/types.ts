export interface TypingStats {
    correct: number
    incorrect: number
    current: number
    total: number
    errorMap: Set<number>
    skipLineUsed: boolean
}

export type GameState = "idle" | "started" | "paused" | "out-of-focus" | "completed"

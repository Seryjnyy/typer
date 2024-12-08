export interface TypingStats {
    correct: number
    incorrect: number
    current: number
    total: number
    errorMap: Set<number>
}

export type GameState = "idle" | "started" | "paused" | "out-of-focus" | "completed"

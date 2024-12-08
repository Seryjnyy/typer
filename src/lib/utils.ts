import { type ClassValue, clsx } from "clsx"

import { twMerge } from "tailwind-merge"
import { TextModificationOptions } from "./store/text-modifications-store"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function round(num: number, decimalPlaces: number = 0) {
    const multiplier = Math.pow(10, decimalPlaces)
    return Math.round(num * multiplier) / multiplier
}

// TODO : Maybe reshuffle again if shuffled arrafy is the same as original
//  would have to check for array of length 1
export function shuffleArray<T>(array: T[]) {
    const cpy = [...array]
    for (let i = cpy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = cpy[i]
        cpy[i] = cpy[j]
        cpy[j] = temp
    }

    return cpy
}

export function chpm(ch: number, seconds: number) {
    return round(ch / (seconds / 60))
}

export function wpm(ch: number, seconds: number) {
    return round(ch / 5 / (seconds / 60))
}

export function formatTimestamp(time: number) {
    const date = new Date(time)

    return `${date.toLocaleTimeString()} - ${date.toLocaleDateString()}`
}

export function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return "0 Bytes"

    const k = 1000
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function calculateAccuracy(correct: number, total: number) {
    if (total == 0) return 0

    return round((correct / total) * 100, 2)
}

export const seeSizeOfStringInLocalStorage = (some: string) => {
    return some ? 3 + (some.length * 16) / (8 * 1024) + " KB" : "Empty (0 KB)"
}

export const splitSongIntoVerses = (song: string) => {
    return song.split(/\n\s*\n/)
}

// I think leave as strings for now so its extendable, like punctuation = ".,/"

// TODO : why isn't textmodificationoptions values optional????
export const textModification = (s: string, options: TextModificationOptions) => {
    let res = s

    if (options?.punctuation == "removed") {
        res = res.replace(/[^a-zA-Z0-9 \r\n]/g, "")
    }

    if (options?.numbers == "removed") {
        res = res.replace(/\d/g, "")
    }

    if (options?.letterCase == "lower") {
        res = res.toLocaleLowerCase()
    }

    if (options?.letterCase == "upper") {
        res = res.toLocaleUpperCase()
    }
    return res
}

export const formatDurationMS = (duration_ms: number): string => {
    const seconds = Math.floor(duration_ms / 1000) % 60
    const minutes = Math.floor(duration_ms / 1000 / 60)
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

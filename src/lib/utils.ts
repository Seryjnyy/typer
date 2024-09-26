import { type ClassValue, clsx } from "clsx";

import { twMerge } from "tailwind-merge";
import { TextModificationOptions } from "./store/text-modifications-store";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// https://stackoverflow.com/a/48764436
export function round(num: number, decimalPlaces: number = 0) {
    num = Math.round(num + "e" + decimalPlaces);
    return Number(num + "e" + -decimalPlaces);
}

// TODO : Maybe reshuffle again if shuffled array is the same as original
// would have to check for array of length 1
export function shuffleArray(array: any[]) {
    const cpy = [...array];
    for (var i = cpy.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = cpy[i];
        cpy[i] = cpy[j];
        cpy[j] = temp;
    }

    return cpy;
}

export function chpm(ch: number, seconds: number) {
    return round(ch / (seconds / 60));
}

export function wpm(ch: number, seconds: number) {
    return round(ch / 5 / (seconds / 60));
}

export function formatTimestamp(time: number) {
    const date = new Date(time);

    return `${date.toLocaleTimeString()} - ${date.toLocaleDateString()}`;
}

export function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return "0 Bytes";

    const k = 1000;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function calculateAccuracy(correct: number, total: number) {
    if (total == 0) return 0;

    return round((correct / total) * 100, 2);
}

export const gradientOptions = {
    directions: [
        "t",
        "tr",
        "r",
        // "br",
        // "b",
        // "bl",
        // "l",
        // "tl"
    ],
    colours: [
        // "red",
        // "green",
        // "blue",
        // "purple",
        // "indigo",
        "orange",
        "rose",
        // "cyan",
        "sky",
        // "fuschia",
        // "pink",
        // "lime",
        "emerald",
        // "teal",
        "violet",
    ],
    steps: [
        // 50,
        // 100,
        200,
        // 300,
        400,
        // 500,
        // 600,
        // 700,
        800,
        // 900,
        950,
    ],
};

export function generateAllPossibleGradients() {
    const combinations = new Set<string>();
    gradientOptions.directions.forEach((dir) => {
        // colour one
        gradientOptions.colours.forEach((colourOption) => {
            gradientOptions.steps.forEach((stepOptionOne) => {
                // pick second colour
                gradientOptions.colours
                    .filter((x) => x != colourOption)
                    .forEach((colourOptionTwo) => {
                        gradientOptions.steps.forEach((stepOptionTwo) => {
                            combinations.add(
                                `bg-gradient-to-${dir} from-${colourOption}-${stepOptionOne} to-${colourOptionTwo}-${stepOptionTwo}`
                            );
                        });
                    });
            });
        });
    });

    console.log(combinations.size);

    return Array.from(combinations.values()).reduce(
        (prev, curr) => prev + " " + curr
    );
}

export function generateGradient() {
    const dir =
        gradientOptions.directions[
            Math.floor(Math.random() * gradientOptions.directions.length)
        ];
    const colourOne =
        gradientOptions.colours[
            Math.floor(Math.random() * gradientOptions.colours.length)
        ];
    const colourTwo = gradientOptions.colours.filter(
        (colour) => colour != colourOne
    )[Math.floor(Math.random() * (gradientOptions.colours.length - 1))];
    const colourOneStep =
        gradientOptions.steps[
            Math.floor(Math.random() * gradientOptions.steps.length)
        ];
    const colourTwoStep =
        gradientOptions.steps[
            Math.floor(Math.random() * gradientOptions.steps.length)
        ];

    const res = `bg-gradient-to-${dir} from-${colourOne}-${colourOneStep} to-${colourTwo}-${colourTwoStep}`;

    return res;
}

export const seeSizeOfStringInLocalStorage = (some: string) => {
    return some ? 3 + (some.length * 16) / (8 * 1024) + " KB" : "Empty (0 KB)";
};

export const splitSongIntoVerses = (song: String) => {
    return song.split(/\n\s*\n/);
};

// I think leave as strings for now so its extendable, like punctuation = ".,/"

// TODO : why isn't textmodificationoptions values optional????
export const textModification = (
    s: string,
    options: TextModificationOptions
) => {
    // console.log(s);
    let res = s;

    if (options?.punctuation == "removed") {
        res = res.replace(/[^a-zA-Z0-9 \r\n]/g, "");
    }

    if (options?.numbers == "removed") {
        res = res.replace(/\d/g, "");
    }

    if (options?.letterCase == "lower") {
        res = res.toLocaleLowerCase();
    }

    if (options?.letterCase == "upper") {
        // console.log("being called");
        res = res.toLocaleUpperCase();
    }
    return res;
};

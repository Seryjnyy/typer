import { type ClassValue, clsx } from "clsx";

import { twMerge } from "tailwind-merge";

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

export function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = [
        "Bytes",
        "KiB",
        "MiB",
        "GiB",
        "TiB",
        "PiB",
        "EiB",
        "ZiB",
        "YiB",
    ];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function calculateAccuracy(correct: number, total: number) {
    if (total == 0) return 0;

    return round((correct / total) * 100, 2);
}

const dirOptions = [
    "t",
    "tr",
    "r",
    // "br",
    // "b",
    // "bl",
    // "l",
    // "tl"
];
const colourOptions = [
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
];
const stepOptions = [
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
];

export function generateAllPossibleGradients() {
    const combinations = new Set<string>();
    dirOptions.forEach((dir) => {
        // colour one
        colourOptions.forEach((colourOption) => {
            stepOptions.forEach((stepOptionOne) => {
                // pick second colour
                colourOptions
                    .filter((x) => x != colourOption)
                    .forEach((colourOptionTwo) => {
                        stepOptions.forEach((stepOptionTwo) => {
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
    const dir = dirOptions[Math.floor(Math.random() * dirOptions.length)];
    const colourOne =
        colourOptions[Math.floor(Math.random() * colourOptions.length)];
    const colourTwo = colourOptions.filter((colour) => colour != colourOne)[
        Math.floor(Math.random() * (colourOptions.length - 1))
    ];
    const colourOneStep =
        stepOptions[Math.floor(Math.random() * stepOptions.length)];
    const colourTwoStep =
        stepOptions[Math.floor(Math.random() * stepOptions.length)];

    const res = `bg-gradient-to-${dir} from-${colourOne}-${colourOneStep} to-${colourTwo}-${colourTwoStep}`;

    return res;
}

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

export function calculateAccuracy(correct: number, total: number) {
    if (total == 0) return 0;

    return round((correct / total) * 100, 2);
}

export function generateGradient() {
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

    const combinations = new Set<string>();
    dirOptions.forEach((dir) => {
        // colour one
        colourOptions.forEach((colourOption) => {
            stepOptions.forEach((stepOptionOne) => {
                // colourOne + stepOption
                // const a = "from-"+colourOption+"-"+stepOptionOne

                // pick second colour
                colourOptions
                    .filter((x) => x != colourOption)
                    .forEach((colourOptionTwo) => {
                        stepOptions.forEach((stepOptionTwo) => {
                            // const b = "to-"+colourOptionTwo+"-"+stepOptionTwo
                            combinations.add(
                                `bg-gradient-to-${dir} from-${colourOption}-${stepOptionOne} to-${colourOptionTwo}-${stepOptionTwo}`
                            );
                        });
                    });
            });
        });

        // colour two
    });

    console.log(combinations.size);
    console.log(
        Array.from(combinations.values()).reduce(
            (prev, curr) => prev + " " + curr
        )
    );

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

import * as fs from "fs";

const some = [
    {
        name: ":root",
        values: `--background: 0 0% 100%;
        --foreground: 224 71.4% 4.1%;
        --card: 0 0% 100%;
        --card-foreground: 224 71.4% 4.1%;
        --popover: 0 0% 100%;
        --popover-foreground: 224 71.4% 4.1%;
        --primary: 262.1 83.3% 57.8%;
        --primary-foreground: 210 20% 98%;
        --secondary: 220 14.3% 95.9%;
        --secondary-foreground: 220.9 39.3% 11%;
        --muted: 220 14.3% 95.9%;
        --muted-foreground: 220 8.9% 46.1%;
        --accent: 262.1 83.3% 57.8%;
        --accent-foreground: 210 20% 98%;
        --destructive: 0 84.2% 60.2%;
        --destructive-foreground: 210 20% 98%;
        --border: 220 13% 91%;
        --input: 220 13% 91%;
        --ring: 262.1 83.3% 57.8%;
        --radius: 1rem;
		--chart-1:283 50% 20%;
		--chart-2:283 60% 40%;
		--chart-3:283 70% 60%;
		--chart-4:283 80% 80%;
		--chart-5:283 90% 100%`,
    },
    {
        name: ".dark-violet",
        values: `
          --background: 224 71.4% 4.1%;
        --foreground: 210 20% 98%;
        --card: 224 71.4% 4.1%;
        --card-foreground: 210 20% 98%;
        --popover: 224 71.4% 4.1%;
        --popover-foreground: 210 20% 98%;
        --primary: 263.4 70% 50.4%;
        --primary-foreground: 210 20% 98%;
        --secondary: 215 27.9% 16.9%;
        --secondary-foreground: 210 20% 98%;
        --muted: 215 27.9% 16.9%;
        --muted-foreground: 217.9 10.6% 64.9%;
        --accent: 215 27.9% 16.9%;
        --accent-foreground: 210 20% 98%;
        --destructive: 0 62.8% 30.6%;
        --destructive-foreground: 210 20% 98%;
        --border: 215 27.9% 16.9%;
        --input: 215 27.9% 16.9%;
        --ring: 263.4 70% 50.4%;
		--chart-1:283 50% 20%;
		--chart-2:283 60% 40%;
		--chart-3:283 70% 60%;
		--chart-4:283 80% 80%;
		--chart-5:283 90% 100%`,
    },
    {
        name: ".light-violet",
        values: ` --background: 0 0% 100%;
    --foreground: 224 71.4% 4.1%;
    --card: 0 0% 100%;
    --card-foreground: 224 71.4% 4.1%;
    --popover: 0 0% 100%;
    --popover-foreground: 224 71.4% 4.1%;
    --primary: 262.1 83.3% 57.8%;
    --primary-foreground: 210 20% 98%;
    --secondary: 220 14.3% 95.9%;
    --secondary-foreground: 220.9 39.3% 11%;
    --muted: 220 14.3% 95.9%;
    --muted-foreground: 220 8.9% 46.1%;
    --accent: 220 14.3% 95.9%;
    --accent-foreground: 220.9 39.3% 11%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 20% 98%;
    --border: 220 13% 91%;
    --input: 220 13% 91%;
    --ring: 262.1 83.3% 57.8%;
    --radius: 1rem;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;`,
    },
    {
        name: ".dark-yellow",
        values: `
 --background: 20 14.3% 4.1%;
--foreground: 60 9.1% 97.8%;
--card: 20 14.3% 4.1%;
--card-foreground: 60 9.1% 97.8%;
--popover: 20 14.3% 4.1%;
--popover-foreground: 60 9.1% 97.8%;
--primary: 47.9 95.8% 53.1%;
--primary-foreground: 26 83.3% 14.1%;
--secondary: 12 6.5% 15.1%;
--secondary-foreground: 60 9.1% 97.8%;
--muted: 12 6.5% 15.1%;
--muted-foreground: 24 5.4% 63.9%;
--accent: 12 6.5% 15.1%;
--accent-foreground: 60 9.1% 97.8%;
--destructive: 0 62.8% 30.6%;
--destructive-foreground: 60 9.1% 97.8%;
--border: 12 6.5% 15.1%;
--input: 12 6.5% 15.1%;
--ring: 35.5 91.7% 32.9%;
--chart-1: 220 70% 50%;
--chart-2: 160 60% 45%;
--chart-3: 30 80% 55%;
--chart-4: 280 65% 60%;
--chart-5: 340 75% 55%;
`,
    },
    {
        name: ".light-yellow",
        values: ` --background: 0 0% 100%;
    --foreground: 20 14.3% 4.1%;
    --card: 0 0% 100%;
    --card-foreground: 20 14.3% 4.1%;
    --popover: 0 0% 100%;
    --popover-foreground: 20 14.3% 4.1%;
    --primary: 47.9 95.8% 53.1%;
    --primary-foreground: 26 83.3% 14.1%;
    --secondary: 60 4.8% 95.9%;
    --secondary-foreground: 24 9.8% 10%;
    --muted: 60 4.8% 95.9%;
    --muted-foreground: 25 5.3% 44.7%;
    --accent: 60 4.8% 95.9%;
    --accent-foreground: 24 9.8% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 60 9.1% 97.8%;
    --border: 20 5.9% 90%;
    --input: 20 5.9% 90%;
    --ring: 20 14.3% 4.1%;
    --radius: 1rem;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;`,
    },
    {
        name: ".light-rose",
        values: `  --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 346.8 77.2% 49.8%;
    --primary-foreground: 355.7 100% 97.3%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 346.8 77.2% 49.8%;
    --radius: 1rem;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;`,
    },
    {
        name: ".dark-rose",
        values: ` --background: 20 14.3% 4.1%;
    --foreground: 0 0% 95%;
    --card: 24 9.8% 10%;
    --card-foreground: 0 0% 95%;
    --popover: 0 0% 9%;
    --popover-foreground: 0 0% 95%;
    --primary: 346.8 77.2% 49.8%;
    --primary-foreground: 355.7 100% 97.3%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 15%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 12 6.5% 15.1%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 85.7% 97.3%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 346.8 77.2% 49.8%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;`,
    },
];

const themes = some.map((theme) => {
    return {
        name: theme.name.substring(1, theme.name.length),
        // values: theme.values
        //     .trim()
        //     .split(";")
        //     .map((x) => x.replace(/(\r\n|\n|\r)/gm, ""))
        //     .filter((x) => x != "")
        //     .map((x) => {
        //         const keyValue = x.split(":");
        //         return {
        //             name: keyValue[0],
        //             value: keyValue[1].trim(),
        //         };
        //     })
        //     .filter(
        //         (x) =>
        //             x.name == "--background" ||
        //             x.name == "--foreground" ||
        //             x.name == "--primary" ||
        //             x.name == "--secondary" ||
        //             x.name == "--secondary-foreground"
        //     ),
    };
});

const themeType = `
    export type Theme = ${themes
        .map((x, index) => "'" + x.name.substring(0, x.name.length) + "'")
        .reduce((prev, curr) => prev + "|" + curr)}
`;

// const themeWithValues = `
//     export const themes : {
//     name: Theme;
//     values: {
//         name: string;
//         value: string;
//     }[];
// }[] = ${JSON.stringify(themes)}
// `;

const themeList = `
    export const themeList : Theme[] = [${themes.map(
        (x, index) => "'" + x.name.substring(0, x.name.length) + "'"
    )}]
`;

fs.writeFile(
    "./src/lib/themes.ts",
    // themeWithValues + "\n" +
    themeType + "\n" + themeList,
    (err) => {
        if (err) {
            console.error(err);
        } else {
            // file written successfully
        }
    }
);

try {
    // const data = fs.readFileSync("./src/index.css", "utf8");
    const data = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
    * {
        @apply border-border;
    }
    body {
        @apply bg-background text-foreground;
    }
}`;

    const modifiedData =
        data +
        `@layer base {
        ${some
            .map((x) => {
                return `${x.name}{
                ${x.values}
            }`;
            })
            .reduce((prev, curr) => prev + "\n" + curr)}
    
    }`;

    try {
        fs.writeFile("./src/index.css", modifiedData, (err) => {
            if (err) {
                console.error(err);
            } else {
                // file written successfully
            }
        });
    } catch (err) {
        console.log(err);
    }
} catch (err) {
    console.error(err);
}

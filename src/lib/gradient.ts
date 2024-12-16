import { GeneratedCover } from "./types"

const formatRGB = (rgb: number[]) => {
    if (rgb.length != 3) return ""
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
}

export const randomDeg = () => {
    return Math.floor(Math.random() * 360)
}

const generateRandomRGB = () => {
    const r = Math.floor(Math.random() * 255)
    const g = Math.floor(Math.random() * 255)
    const b = Math.floor(Math.random() * 255)
    return [r, g, b]
}

export const randomRGB = () => {
    return formatRGB(generateRandomRGB())
}

export const createRandomCover = () => {
    return createRandomCoverWithColours([randomRGB(), randomRGB()])
}

// Colours is never checked so anything could be passed in and break the gradient
export const createRandomCoverWithColours = (colours: string[]) => {
    return {
        type: "linear-gradient" as const,
        dir: randomDeg(),
        colours: colours,
    }
}

export const parseGeneratedCoverString = (coverString: string) => {
    try {
        return JSON.parse(coverString) as GeneratedCover
    } catch (e) {
        console.error("Failed to parse cover string", e)
        // Shouldn't happen but just in case
        return {
            type: "linear-gradient" as const,
            dir: 0,
            colours: ["transparent", "transparent"],
        }
    }
}

export const coverAsStyle = (cover: GeneratedCover): Pick<React.CSSProperties, "backgroundImage"> => {
    return {
        backgroundImage: `${cover.type}(${cover.dir}deg, ${cover.colours.join(", ")})`,
    }
}

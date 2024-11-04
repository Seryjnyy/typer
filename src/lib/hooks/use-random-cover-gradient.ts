import { useState } from "react";
import { randomDeg, randomRGB } from "../gradient";
import { GeneratedCover } from "../types";

// TODO : I don't like this, does it really need to be a hook? I can just put this into a utils file without state tbh
// Also currently only used in create song form
const useRandomCoverGradient = () => {
    const createRandomCover = () => {
        return {
            type: "linear-gradient" as const,
            dir: randomDeg(),
            colours: [randomRGB(), randomRGB()],
        };
    };

    const [cover, setCover] = useState<GeneratedCover>(createRandomCover());

    const generateRandomCover = () => {
        setCover(createRandomCover());
    };
    return {
        cover,
        generateRandomCover,
    };
};

export default useRandomCoverGradient;

import React from "react";
import { useMediaQuery } from "react-responsive";

export default function useScreenSize() {
    const isSm = useMediaQuery({
        query: "(min-width: 640px)",
    });
    const isMd = useMediaQuery({
        query: "(min-width: 768px)",
    });
    const isLg = useMediaQuery({
        query: "(min-width: 1024px)",
    });

    return { isSm, isMd, isLg };
}

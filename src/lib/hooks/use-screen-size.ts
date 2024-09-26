import React from "react";
import { useMediaQuery } from "react-responsive";

// TODO : maybe props with string, then switch based on string to get query
// idk if having many hooks hurts performance
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
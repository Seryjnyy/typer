import { useMediaQuery } from "react-responsive"

// TODO : maybe props with string, then switch based on string to get query
// idk if having many hooks hurts performance
// TODO : just use useMediaQuery an provide the queries as variables
export default function useScreenSize() {
    const isSm = useMediaQuery({
        query: "(min-width: 640px)",
    })
    const isMd = useMediaQuery({
        query: "(min-width: 768px)",
    })
    const isLg = useMediaQuery({
        query: "(min-width: 1024px)",
    })

    return { isSm, isMd, isLg }
}

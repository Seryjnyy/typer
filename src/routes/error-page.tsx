import { useRouteError } from "react-router-dom"

export default function ErrorPage() {
    const error = useRouteError()
    console.error(error)

    // This is straight from react-router-dom so the code should be correct, but I'm not sure rn how stop it from
    // giving error of error is of type unknown.
    return (
        <div id="error-page" className="flex justify-center flex-col min-h-screen items-center">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </div>
    )
}

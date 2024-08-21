import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import ErrorPage from "./routes/error-page";
import Root from "./routes/root";
import Appearance from "./routes/settings/appearance";
import Storage from "./routes/settings/storage";

import SettingsWindow from "./settings-window";
import SongsWindow from "./songs-window";
import TyperWindow from "./typer-window";
import VersePage from "./routes/typer/verse/verse-page";
import TyperTestPage from "./routes/typer/typer-page-test";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,

        // loader: rootLoader,
        children: [
            {
                path: "/",
                element: <TyperTestPage />,
            },
            { path: "verse", element: <VersePage /> },
            {
                path: "/songs",
                element: <SongsWindow />,
            },
            {
                path: "/settings",
                element: <SettingsWindow />,
                children: [
                    {
                        path: "appearance",
                        element: <Appearance />,
                    },
                    {
                        element: <Storage />,
                        index: true,
                    },
                    {
                        path: "storage",
                        element: <Storage />,
                    },
                    {
                        path: "progress",
                        element: "progress",
                    },
                ],
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);

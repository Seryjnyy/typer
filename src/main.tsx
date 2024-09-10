import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import ErrorPage from "./routes/error-page";
import Root from "./routes/root";
import Appearance from "./routes/settings/appearance";
import Storage from "./routes/settings/storage";

import SettingsWindow from "./settings-window";
import SongsWindow from "./routes/song/songs-window";
import TyperWindow from "./typer-window";
import VersePage from "./routes/typer/verse/verse-page";
import TyperTestPage from "./routes/typer/typer-page-test";
import SongPage from "./routes/song/song-page";
import SongsList from "./routes/song/songs-list";
import Test from "./test";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,

        // loader: rootLoader,
        children: [
            {
                path: "/",
                // element: <TyperTestPage />,
                element: <Test />,
            },
            { path: "verse", element: <VersePage /> },
            {
                path: "/songs",
                element: <SongsWindow />,
                children: [
                    {
                        path: "/songs",
                        element: <SongsList />,
                        index: true,
                    },
                    {
                        path: "/songs/:songID",
                        element: <SongPage />,
                    },
                ],
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

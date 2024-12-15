import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import "./index.css"
import ErrorPage from "./routes/error-page"
import Root from "./routes/root"
import Appearance from "./routes/settings/appearance"
import Storage from "./routes/settings/storage"

import SettingsWindow from "./routes/settings/settings-window"
import Song from "./routes/song/song-page"
import Songs from "./routes/song/songs"
import SongsPage from "./routes/song/songs-window"

import VerseSourceTyper from "./components/typer/verse-source-typer.tsx"
import EditSong from "./routes/song/edit-song"
import Preferences from "./routes/settings/preferences"
import ImportExport from "./routes/settings/import-export"
import Spotify from "./routes/settings/spotify"
import Stats from "./routes/settings/stats"
import PlaylistPage from "./routes/song/playlist/playlist-page"
import PlaylistEdit from "./routes/song/playlist/playlist-edit"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import QueueSourceTyper from "@/components/typer/queue-source-typer.tsx"
import Shortcuts from "@/routes/settings/shortcuts.tsx"
import TestPage from "@/test-page.tsx"

const queryClient = new QueryClient()

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,

        // loader: rootLoader,
        children: [
            {
                path: "/",
                element: <QueueSourceTyper />,
            },
            { path: "verse", element: <VerseSourceTyper /> },
            {
                path: "/songs",
                element: <SongsPage />,
                children: [
                    {
                        element: <Songs />,
                        index: true,
                    },
                    {
                        path: "/songs/:songID",
                        element: <Song />,
                    },
                    {
                        path: "/songs/playlist/:playlistID",
                        element: <PlaylistPage />,
                    },
                    {
                        path: "/songs/playlist/:playlistID/edit",
                        element: <PlaylistEdit />,
                    },
                    {
                        path: "/songs/:songID/edit",
                        element: <EditSong />,
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
                        element: <Appearance />,
                        index: true,
                    },
                    {
                        path: "storage",
                        element: <Storage />,
                    },
                    {
                        path: "preferences",
                        element: <Preferences />,
                    },
                    {
                        path: "spotify",
                        element: <Spotify />,
                    },
                    {
                        path: "stats",
                        element: <Stats />,
                    },
                    {
                        path: "import-export",
                        element: <ImportExport />,
                    },
                    {
                        path: "shortcuts",
                        element: <Shortcuts />,
                    },
                ],
            },
            {
                path: "/test",
                element: <TestPage />,
            },
        ],
    },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    </React.StrictMode>
)

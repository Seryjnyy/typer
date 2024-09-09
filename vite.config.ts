import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: ["vite.svg"],
            manifest: {
                name: "typer",
                short_name: "typer",
                description: "Typing app.",
                theme_color: "#ffffff",
                background_color: "#ffffff",
                display: "standalone",
                scope: "/",
                start_url: "/",
                icons: [
                    {
                        src: "/keyboard.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                ],
            },
            devOptions: {
                enabled: true,
            },
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});

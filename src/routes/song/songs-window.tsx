import React from "react";
import SongsList from "./songs-list";
import { Outlet } from "react-router";

export default function SongsWindow() {
    return (
        <div className="w-full h-full">
            <Outlet />
        </div>
    );
}

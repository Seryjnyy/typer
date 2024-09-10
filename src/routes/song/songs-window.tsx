import React from "react";
import SongsList from "./songs-list";
import { Outlet, useParams } from "react-router";

export default function SongsWindow() {
    return (
        <div className="w-full h-full">
            <Outlet />
        </div>
    );
}

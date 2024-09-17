import React from "react";
import Songs from "./songs";
import { Outlet, useParams } from "react-router";

export default function SongsPage() {
    return (
        <div className="w-full h-full ">
            <Outlet />
        </div>
    );
}

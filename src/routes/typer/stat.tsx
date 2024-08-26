import React from "react";

interface StatProps {
    title: string;
    stat: string | number | boolean;
    append?: string;
}
export default function Stat({ title, stat, append }: StatProps) {
    let statText = stat;

    if (typeof stat === "boolean") {
        statText = stat ? "true" : "false";
    }

    return (
        <div className="flex justify-between">
            <span>{title}</span>
            <span className="text-muted-foreground">
                {statText}
                {append}
            </span>
        </div>
    );
}

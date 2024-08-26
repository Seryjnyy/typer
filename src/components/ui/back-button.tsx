import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

interface BackButtonProps {
    link: string;
}

export default function BackButton({ link }: BackButtonProps) {
    return (
        <Link to={link}>
            <Button variant={"ghost"} className="space-x-2 group">
                <ArrowLeftIcon className="group-hover:-translate-x-1 transition-transform" />{" "}
                <span>Back</span>
            </Button>
        </Link>
    );
}

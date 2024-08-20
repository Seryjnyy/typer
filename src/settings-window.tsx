import { Outlet, useLocation } from "react-router";
import { Link } from "react-router-dom";
import { ScrollArea } from "./components/ui/scroll-area";

export default function SettingsWindow() {
    const location = useLocation();
    const split = location.pathname.split("/");
    const current = split.length > 2 ? split[split.length - 1] : "storage";

    if (
        current != "storage" &&
        current != "appearance" &&
        current != "progress" &&
        current != "" &&
        split.length != 2
    ) {
        throw Error("Not found.");
    }

    const links = [
        { link: "storage", label: "Storage" },
        { link: "appearance", label: "Appearance" },
        { link: "progress", label: "Progress" },
    ];

    return (
        <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4  p-4 md:gap-8 md:p-10">
            <div className="mx-auto grid w-full max-w-6xl gap-2">
                <h1 className="text-3xl font-semibold">Settings</h1>
            </div>
            <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
                <nav
                    className="grid gap-4 text-sm text-muted-foreground"
                    x-chunk="dashboard-04-chunk-0"
                >
                    {links.map((link) => {
                        return (
                            <Link
                                key={link.link}
                                to={link.link}
                                className={
                                    current == link.link
                                        ? "font-semibold text-primary"
                                        : ""
                                }
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
                <ScrollArea className="h-[calc(100vh-10rem)] pb-4 w-full px-3 ">
                    <div className="grid gap-6">
                        <Outlet />
                    </div>
                </ScrollArea>
            </div>
        </main>
    );
}

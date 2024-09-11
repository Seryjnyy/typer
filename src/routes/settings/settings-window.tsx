import { Outlet, useLocation } from "react-router";
import { Link } from "react-router-dom";
import { ScrollArea } from "../../components/ui/scroll-area";

export default function SettingsWindow() {
    const location = useLocation();
    const split = location.pathname.split("/");
    const current = split.length > 2 ? split[split.length - 1] : "storage";

    if (
        current != "storage" &&
        current != "appearance" &&
        // current != "progress" &&
        current != "" &&
        split.length != 2
    ) {
        throw Error("Not found.");
    }

    const links = [
        { link: "storage", label: "Storage" },
        { link: "appearance", label: "Appearance" },
        // { link: "progress", label: "Progress" },
    ];

    return (
        <main className="min-h-[calc(100vh_-_theme(spacing.16))]  flex-1 flex gap-4   md:gap-8 ">
            <div className="mx-auto w-fit max-w-6xl gap-2  p-8 md:p-16 space-y-8">
                <h1 className="text-3xl font-semibold">Settings</h1>
                <nav className="grid gap-4 text-sm text-muted-foreground ">
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
            </div>
            <div className="w-full max-w-6xl items-start gap-6 h-full ">
                <ScrollArea className="h-[calc(100vh-4rem)] pb-4 w-full px-3  ">
                    <div className="w-full py-12 md:px-18 lg:px-24">
                        <Outlet />
                    </div>
                </ScrollArea>
            </div>
        </main>
    );
}

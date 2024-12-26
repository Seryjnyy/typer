import { Outlet, useLocation } from "react-router"
import { Link } from "react-router-dom"
import { ScrollArea } from "../../components/ui/scroll-area"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MenuIcon } from "lucide-react"
import { Cross1Icon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"

const SettingsMobileMenu = ({
    links,
    current,
    className,
}: {
    links: { link: string; label: string }[]
    current: string
    className?: string
}) => {
    const [open, setOpen] = useState(false)

    if (!open)
        return (
            <div className={cn(className, "w-full flex justify-between items-center  px-2")}>
                <div className="capitalize pl-2 font-bold text-muted-foreground">{current}</div>
                <Button size={"icon"} variant={"ghost"} onClick={() => setOpen(true)}>
                    <MenuIcon />
                </Button>
            </div>
        )

    return (
        <div className={cn(" w-full  relative", className)}>
            <div className=" px-2 absolute top-0 right-0">
                <Button size={"icon"} variant={"ghost"} onClick={() => setOpen(false)}>
                    <Cross1Icon />
                </Button>
            </div>
            <div className="space-y-8 w-full flex flex-col items-center py-12 border-b ">
                <h1 className="text-3xl font-semibold">Settings</h1>
                <nav className="grid gap-4 text-sm text-muted-foreground ">
                    {links.map((link) => {
                        return (
                            <Link
                                key={link.link}
                                to={link.link}
                                className={current == link.link ? "font-semibold text-primary" : ""}
                                onClick={() => setOpen(false)}
                            >
                                {link.label}
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </div>
    )
}

export default function SettingsWindow() {
    const location = useLocation()
    const split = location.pathname.split("/")
    const current = split.length > 2 ? split[split.length - 1] : "appearance"

    if (
        current != "storage" &&
        current != "appearance" &&
        current != "preferences" &&
        current != "import-export" &&
        current != "spotify" &&
        current != "shortcuts" &&
        // current != "stats" &&
        current != "" &&
        split.length != 2
    ) {
        throw Error("Settings page: Can't find subsection.")
    }

    const links = [
        { link: "appearance", label: "Appearance" },
        { link: "storage", label: "Storage" },
        { link: "preferences", label: "Preferences" },
        { link: "import-export", label: "Import & Export" },
        { link: "spotify", label: "Spotify" },
        { link: "shortcuts", label: "Shortcuts" },
        // { link: "stats", label: "Stats" },
        // { link: "progress", label: "Progress" },
    ]

    return (
        <main className="min-h-[calc(100vh-4rem)]  flex-1 flex gap-4 flex-col sm:flex-row   md:gap-8 ">
            <div className="mx-auto w-fit max-w-6xl gap-2  py-8 px-4 md:p-10 lg:p-16 space-y-8 hidden sm:block">
                <h1 className="text-3xl font-semibold">Settings</h1>
                <nav className="grid gap-4 text-sm text-muted-foreground ">
                    {links.map((link) => {
                        return (
                            <Link key={link.link} to={link.link} className={current == link.link ? "font-semibold text-primary" : ""}>
                                {link.label}
                            </Link>
                        )
                    })}
                </nav>
            </div>
            <SettingsMobileMenu links={links} current={current} className="block sm:hidden" />

            <div className="w-full max-w-6xl items-start gap-6 h-full rounded-tr-md rounded-br-md overflow-hidden">
                <ScrollArea className="h-[calc(100vh-5.1rem)]  w-full px-3 sm:pr-3 sm:pl-0  pb-20 sm:pb-0  ">
                    <div className="w-full py-12  lg:px-20">
                        <Outlet />
                    </div>
                </ScrollArea>
            </div>
        </main>
    )
}

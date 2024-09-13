import { Outlet } from "react-router";
import BottomNav from "../components/bottom-nav";
import { ThemeProvider } from "../components/theme-provider";
import { Toaster } from "../components/ui/toaster";
import { TooltipProvider } from "../components/ui/tooltip";
import Queue from "../components/queue";
import TailwindGradientHack from "../tailwind-gradient-hack/tailwind-gradient-hack";

function Root() {
    return (
        <div>
            <ThemeProvider defaultTheme="dark-rose" storageKey="vite-ui-theme">
                <TooltipProvider delayDuration={100}>
                    <div className="h-screen overflow-hidden">
                        <div className="md:hidden flex justify-center h-full items-center">
                            Sorry site not responsive yet :/
                        </div>
                        <div className="hidden sm:flex flex-col h-full justify-end">
                            <main className="flex-grow w-full  flex justify-between z-0 h-[calc(100vh-4rem)]">
                                <div className="z-0 w-full border my-2 ml-2 rounded-md ">
                                    <Outlet />
                                </div>
                                <div className="z-20 p-2">
                                    <Queue />
                                </div>
                            </main>
                            <nav className="z-20 h-[4rem]">
                                <BottomNav />
                            </nav>
                        </div>
                    </div>
                    <Toaster />
                </TooltipProvider>
            </ThemeProvider>
            <TailwindGradientHack />
        </div>
    );
}

export default Root;

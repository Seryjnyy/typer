import BottomNav from "./bottom-nav";
import Window from "./window";
import Queue from "./queue";
import TyperWindow from "./typer-window";
import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "./components/theme-provider";

function App() {
    return (
        <>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <div className="h-screen">
                    <div className="sm:hidden flex justify-center h-full items-center">
                        Sorry site not responsive yet :/
                    </div>
                    <div className="hidden sm:flex flex-col h-full justify-end">
                        <main className="flex-grow w-full  flex justify-between z-0">
                            <div className="z-0 w-full  overflow-hidden">
                                <Window />
                            </div>
                            <div className="z-20 ">
                                <Queue />
                            </div>
                        </main>
                        <nav className="z-20 h-[4rem] ">
                            <BottomNav />
                        </nav>
                    </div>
                </div>

                <Toaster />
            </ThemeProvider>
        </>
    );
}

export default App;

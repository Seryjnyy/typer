import BottomNav from "./bottom-nav";
import Window from "./window";
import Queue from "./queue";
import TyperWindow from "./typer-window";

function App() {
  return (
    <>
      <div className="flex flex-col h-screen bg-violet-100 justify-end">
        <div className="h-full w-full  flex justify-between z-0">
          <Window />
          <div className="z-20">
            <Queue />
          </div>
        </div>
        <div className="z-20">
          <BottomNav />
        </div>
      </div>

      <div className="fixed right-0 top-0 h-[92vh] bg-background"></div>
    </>
  );
}

export default App;

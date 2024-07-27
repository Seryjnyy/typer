import BottomNav from "./bottom-nav";
import Queue from "./queue";
import TextDisplay from "./text-display";

function App() {
  return (
    <>
      <TextDisplay />

      <div className="fixed right-0 top-0 h-[92vh] bg-background">
        <Queue />
      </div>
      <BottomNav />
    </>
  );
}

export default App;

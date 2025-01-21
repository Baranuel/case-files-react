import { SelectedItem } from "./SelectedItem";
import { Canvas } from "./Canvas";
import { Toolbar } from "./Toolbar";
import { CanvasProvider } from "@/app/providers/CanvasProvider";

export const Board = () => {

  return (
    <CanvasProvider>
        <div className="relative overflow-hidden h-[calc(100vh-4rem)] w-full ">
            <SelectedItem />
            <Canvas />
            <Toolbar />
        </div>
    </CanvasProvider>
  );
};

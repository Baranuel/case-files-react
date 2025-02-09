import { SelectedItem } from "./SelectedItem";
import { Canvas } from "./Canvas";
import { Toolbar } from "./Toolbar";
import { CanvasProvider } from "@/app/providers/CanvasProvider";
import { Lookup } from "./Lookup/Lookup";

export const Board = () => {

  return (
    <CanvasProvider>
        <div className="relative overflow-hidden h-[calc(100vh-4rem)]  w-full  bg-[#2C2420]">
            <SelectedItem />
            <Canvas />
            <Toolbar />
            <Lookup />
        </div>
        <div id="image-picker-root" />
    </CanvasProvider>
  );
};

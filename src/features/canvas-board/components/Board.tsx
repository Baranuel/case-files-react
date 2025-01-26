import { SelectedItem } from "./SelectedItem";
import { Canvas } from "./Canvas";
import { Toolbar } from "./Toolbar";
import { CanvasProvider } from "@/app/providers/CanvasProvider";
import { Suspense } from "react";
import { createPortal } from "react-dom";

export const Board = () => {

  return (
    <CanvasProvider>
        <div className="relative overflow-hidden h-full w-full ">
          <Suspense fallback={<div>Loading...</div>}>
            <SelectedItem />
          </Suspense>
            <Canvas />
            <Toolbar />
        </div>
        <div id="image-picker-root" />
    </CanvasProvider>
  );
};

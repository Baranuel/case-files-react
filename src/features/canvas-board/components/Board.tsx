import { SelectedItem } from "./SelectedItem";
import { Canvas } from "./Canvas";
import { Toolbar } from "./Toolbar";
import { CanvasProvider } from "@/app/providers/CanvasProvider";
import { Zero } from "@rocicorp/zero";
import { schema } from "@/schema";
import { ZeroProvider } from "@rocicorp/zero/react";

export const Board = ({boardId}: {boardId: string}) => {



  return (
    <CanvasProvider>
        <div className="flex justify-center items-center h-full gap-4 pr-2 overflow-y-hidden">
          <div className="flex w-2/5 h-full">
            <SelectedItem />
          </div>
          <div className="flex justify-center items-center w-full h-[90%] border-4 border-amber-700 rounded-lg bg-amber-900 p-2 relative">
            <Toolbar />
            <Canvas />
          </div>
        </div>
    </CanvasProvider>
  );
};

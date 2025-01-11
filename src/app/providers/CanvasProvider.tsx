import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { createGenericContext } from "./genericContext";
import { ActionType, Element, Tool } from "@/types";
import { useSubscribe } from "replicache-react";
import { getAllElements } from "@/lib/replicache/queries";
import { useReplicache } from "./ReplicacheProvider";
import { useVisibleElements } from "@/features/canvas-board/hooks/use-visible-elements";
import { Camera } from "@/features/canvas-board/types";

interface CanvasContextType {
  elementsList: Element[];
  canvasRef: React.RefObject<HTMLCanvasElement>;
  visibleElements: Element[];
  tool: Tool;
  selectedItemId: Element['id'] | null;
  camera: Camera;
  action: ActionType | null;
  setVisibleElements: React.Dispatch<React.SetStateAction<Element[]>>;
  setSelectedItemId: React.Dispatch<React.SetStateAction<Element['id'] | null>>;
  setCamera: React.Dispatch<React.SetStateAction<Camera>>;
  setAction: React.Dispatch<React.SetStateAction<ActionType | null>>;
  setTool: React.Dispatch<React.SetStateAction<Tool>>;
}

interface CanvasProviderProps {
  children: ReactNode;
}

const [useCanvas, CanvasContextProvider] =
  createGenericContext<CanvasContextType>();

const CanvasProvider = ({ children }: CanvasProviderProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rep = useReplicache();
  const elementsList = useSubscribe(rep, getAllElements, {default: []});
  const [camera, setCamera] = useState<Camera>({x1: 0, y1: 0, zoom: 1});
  const [selectedItemId, setSelectedItemId] = useState<Element['id'] | null>(null);
  const [action, setAction] = useState<ActionType | null>(null);
  const [tool, setTool] = useState<Tool>('select');
  const {visibleElements, setVisibleElements} = useVisibleElements(elementsList);

  console.log(visibleElements.length);


  const value = useMemo(() => {
    return {
      elementsList,
      camera,
      canvasRef,
      selectedItemId,
      setSelectedItemId,
      visibleElements,
      setVisibleElements,
      setCamera,
      action,
      setAction,
      tool,
      setTool
    };
  }, [elementsList, camera, canvasRef, selectedItemId, setSelectedItemId, visibleElements, setVisibleElements, action, setAction, tool, setTool]);



  return (
    <CanvasContextProvider value={value}>{children}</CanvasContextProvider>
  );
};

export { CanvasProvider, useCanvas };

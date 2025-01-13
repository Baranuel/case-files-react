import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  tool: Tool;
  selectedItemId: Element['id'] | null;
  cameraRef: React.RefObject<Camera>;
  clientElementsRef: React.RefObject<Element[]>;
  action: ActionType | null;
  visibleElements: Element[];
  ghostElementsRef: React.RefObject<Element | null>;
  setVisibleElements: React.Dispatch<React.SetStateAction<Element[]>>;
  setSelectedItemId: React.Dispatch<React.SetStateAction<Element['id'] | null>>;
  setCamera: (camera: Camera | ((prev: Camera) => Camera)) => void;
  setClientElementsRef: (elements: Element[] | ((prev: Element[]) => Element[])) => void;
  setAction: React.Dispatch<React.SetStateAction<ActionType | null>>;
  setTool: React.Dispatch<React.SetStateAction<Tool>>;
  setGhostElementsRef: (element: Element | null) => void;
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
  const [selectedItemId, setSelectedItemId] = useState<Element['id'] | null>(null);
  const [action, setAction] = useState<ActionType | null>(null);
  const [tool, setTool] = useState<Tool>('select');
  const {visibleElements, setVisibleElements} = useVisibleElements(elementsList);

  console.log('render')

  // setup ref so we don't rerender the entire react tree when the camera changes
  const cameraRef = useRef<Camera>({x1: 0, y1: 0, zoom: 1});

  const setCameraRef = (camera: Camera | ((prev: Camera) => Camera)) => {
    if (typeof camera === 'function') {
      cameraRef.current = camera(cameraRef.current);
    } else {
      cameraRef.current = camera;
    }
  }


  const clientElementsRef = useRef<Element[]>([]);
  const setClientElementsRef = (elements: Element[] | ((prev: Element[]) => Element[])) => {
    if (typeof elements === 'function') {
      clientElementsRef.current = elements(clientElementsRef.current);
    } else {
      clientElementsRef.current = elements;
    }
  }

  const ghostElementsRef = useRef<Element | null>(null);
  const setGhostElementsRef = (element: Element | null) => {
    ghostElementsRef.current = element;
  }


  
useEffect(() => {
    setClientElementsRef(elementsList);
}, [elementsList])
  
  const value = useMemo(() => ({
    elementsList,
    cameraRef,
    canvasRef,
    clientElementsRef,
    selectedItemId,
    setSelectedItemId,
    action,
    setAction,
    tool,
    setTool,
    setCamera: setCameraRef,
    setClientElementsRef,
    visibleElements,
    setVisibleElements,
    ghostElementsRef,
    setGhostElementsRef
  }), [elementsList, cameraRef, selectedItemId, action, tool, visibleElements]);

  return (
    <CanvasContextProvider value={value}>{children}</CanvasContextProvider>
  );
};

export { CanvasProvider, useCanvas };

import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createGenericContext } from "./genericContext";
import { ActionType, Element, EnrichedElement, Tool } from "@/types";
import { useSubscribe } from "replicache-react";
import { getAllElements } from "@/lib/replicache/queries";
import { useReplicache } from "./ReplicacheProvider";
import { Camera } from "@/features/canvas-board/types";

interface CanvasContextType {
  elementsList: Element[];
  canvasRef: React.RefObject<HTMLCanvasElement>;
  tool: Tool;
  action: ActionType | null;
  previewElementId: Element['id'] | null;
  clientViewRef: React.RefObject<ClientView>;
  setPreviewElementId: React.Dispatch<React.SetStateAction<Element['id'] | null>>;
  setAction: React.Dispatch<React.SetStateAction<ActionType | null>>;
  setTool: React.Dispatch<React.SetStateAction<Tool>>;
  setClientViewRef: (clientView: ClientView | ((prev: ClientView) => ClientView)) => void;
}

interface CanvasProviderProps {
  children: ReactNode;
}


interface ClientView {
  elements: Element[];
  camera: Camera;
  ghostElement: Element | null;
  lastClickedPosition: {x1: number, y1: number},
  selectedItemId: Element['id'] | null,
  lastInteractionElement: EnrichedElement | null
}

const [useCanvas, CanvasContextProvider] =
  createGenericContext<CanvasContextType>();

const CanvasProvider = ({ children }: CanvasProviderProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rep = useReplicache();
  const elementsList = useSubscribe(rep, getAllElements, {default: []});
  const [previewElementId, setPreviewElementId] = useState<Element['id'] | null>(null);
  const [action, setAction] = useState<ActionType | null>(null);
  const [tool, setTool] = useState<Tool>('select');


  // setup ref so we don't rerender the entire react tree when the camera changes
  const clientViewRef = useRef<ClientView>({
    elements: [],
    camera: {x1: 0, y1: 0, zoom: 1}, 
    ghostElement: null,
    lastClickedPosition: {x1: 0, y1: 0},
    selectedItemId: null,
    lastInteractionElement: null
  });

  const setClientViewRef = (clientView: ClientView | ((prev: ClientView) => ClientView)) => {
    if (typeof clientView === 'function') {
      clientViewRef.current = clientView(clientViewRef.current);
    } else {
      clientViewRef.current = clientView;
    }
  }


  
useEffect(() => {
    setClientViewRef(prev => ({...prev, elements: elementsList}));
}, [elementsList])

console.log('elementsList', elementsList)

  const value = useMemo(() => ({
    elementsList,
    canvasRef,
    previewElementId,
    action,
    tool,
    clientViewRef,
    setPreviewElementId,
    setAction,
    setTool,
    setClientViewRef
  }), [elementsList, previewElementId, action, tool]);

  return (
    <CanvasContextProvider value={value}>{children}</CanvasContextProvider>
  );
};

export { CanvasProvider, useCanvas };

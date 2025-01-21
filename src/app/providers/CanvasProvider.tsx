import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createGenericContext } from "./genericContext";
import { ActionType, Element, EnrichedElement, Tool } from "@/types";
import { Element as ZeroElement } from "@/schema";
import { Camera } from "@/features/canvas-board/types";
import { useQuery, useZero } from "@rocicorp/zero/react";
import { ZeroSchema } from "@/schema";
import { useParams } from "@tanstack/react-router";

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
  elements:Element[];
  camera: Camera;
  ghostElement: Element | null;
  lastClickedPosition: {x1: number, y1: number},
  selectedItemId: Element['id'] | null,
  lastInteractionElement: EnrichedElement | null
}


const [useCanvas, CanvasContextProvider] =
  createGenericContext<CanvasContextType | null>();


const CanvasProvider = ({ children }: CanvasProviderProps) => {
  const {boardId} = useParams({strict:false});

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const zero = useZero<ZeroSchema>();
  const [ elementsListZ, elementsListStatus] = useQuery(zero.query.element.related('content').where('boardId', "=", boardId!), true);
  const [previewElementId, setPreviewElementId] = useState<Element['id'] | null>(null);
  const [action, setAction] = useState<ActionType | null>(null);
  const [tool, setTool] = useState<Tool>('select');

  // setup ref so we don't rerender the entire react tree when the client view changes
  // we can do this thanks to rendering canvas on every device frame so updating refs will always have visual change
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
    setClientViewRef(prev => ({...prev, elements: [...elementsListZ],}));
}, [elementsListZ, elementsListStatus])





const value = useMemo(() => ({
  elementsList: [...elementsListZ],
  canvasRef,
  previewElementId,
  action,
  tool,
  clientViewRef,
  setPreviewElementId,
  setAction,
  setTool,
  setClientViewRef
}), [elementsListZ, previewElementId, action, tool, elementsListStatus]);



  return (
    <CanvasContextProvider value={value}>{children}</CanvasContextProvider>
  );
};

export { CanvasProvider, useCanvas };

import { ReactNode, useMemo, useRef, useState } from "react";
import { createGenericContext } from "./genericContext";
import { Element } from "@/types";
import { useVisibleElements } from "@/features/canvas-board/hooks/use-visible-elements";
import { useSubscribe } from "replicache-react";
import { getAllElements } from "@/lib/replicache/queries";
import { useReplicache } from "./ReplicacheProvider";

interface CanvasContextType {
  elements: Element[];
  setElements: (elements: Element[]) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  selectedItemId: Element['id'] | null;
  setSelectedItemId: (id: Element['id'] | null) => void;
}

interface CanvasProviderProps {
  children: ReactNode;
}

const [useCanvas, CanvasContextProvider] =
  createGenericContext<CanvasContextType>();

const CanvasProvider = ({ children }: CanvasProviderProps) => {
  const rep = useReplicache();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedItemId, setSelectedItemId] = useState<Element['id'] | null>(null);

  const elementsList = useSubscribe(rep, getAllElements, {
    default: [],
  });

  const { boardElements: elements, setBoardElements: setElements } =
    useVisibleElements(elementsList);


  const value = useMemo(() => {
    return {
      elements,
      setElements,
      canvasRef,
      selectedItemId,
      setSelectedItemId,
    };
  }, [elements, setElements, canvasRef, selectedItemId, setSelectedItemId]);

  return (
    <CanvasContextProvider value={value}>{children}</CanvasContextProvider>
  );
};

export { CanvasProvider, useCanvas };

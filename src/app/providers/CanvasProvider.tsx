import { ReactNode, useMemo, useRef } from "react";
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
}

interface CanvasProviderProps {
  children: ReactNode;
}

const [useCanvas, CanvasContextProvider] =
  createGenericContext<CanvasContextType>();

const CanvasProvider = ({ children }: CanvasProviderProps) => {
  const rep = useReplicache();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
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
    };
  }, [elements, setElements, canvasRef]);

  return (
    <CanvasContextProvider value={value}>{children}</CanvasContextProvider>
  );
};

export { CanvasProvider, useCanvas };

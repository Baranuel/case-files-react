import { ReactNode, useEffect, useRef, useState } from "react";
import { useReplicache } from "./ReplicacheProvider";
import { createGenericContext } from "./genericContext";
import { getAllElements } from "@/lib/replicache/queries";
import { useSubscribe } from "replicache-react";
import { Element } from "@/types";
import { useVisibleElements } from "@/hooks/use-visible-elements";

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
  const { 
    boardElements: elements, 
    setBoardElements: setElements } = useVisibleElements();

    const canvasRef = useRef<HTMLCanvasElement>(null);

  const value = {
    elements,
    setElements,
    canvasRef,
  };

  return (
    <CanvasContextProvider value={value}>{children}</CanvasContextProvider>
  );
};

export { CanvasProvider, useCanvas };

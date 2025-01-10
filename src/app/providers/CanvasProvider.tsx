import { ReactNode, useEffect } from "react";
import { useReplicache } from "./ReplicacheProvider";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { createGenericContext } from "./genericContext";

interface CanvasContextType {
  temp: string;
}

interface CanvasProviderProps {
  children: ReactNode;
}

const [useCanvas, CanvasContextProvider] = createGenericContext<CanvasContextType>();

const CanvasProvider = ({ children }: CanvasProviderProps) => {
  const { rep } = useReplicache();


  const value = {
    temp: "hello",
  };


  return (
    <CanvasContextProvider value={value}>{children}</CanvasContextProvider>
  );
};

export { CanvasProvider, useCanvas };

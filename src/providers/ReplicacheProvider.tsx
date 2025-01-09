import {
  ReactNode,
  useEffect,
  useState,
} from "react";
import { Replicache } from "replicache";
import { createGenericContext } from "./genericContext";
import { BASE_API_URL } from "../constants";

interface ReplicacheContextType {
  rep: Replicache | null;
}

interface ReplicacheProviderProps {
  children: ReactNode;
  boardId: string;
}

const [useReplicache, ReplicacheContextProvider] = createGenericContext<ReplicacheContextType>();

const ReplicacheProvider = ({
  children,
  boardId,
}: ReplicacheProviderProps) => {
  const [rep, setRep] = useState<Replicache | null>(null);
  
  useEffect(() => {
    const rep = new Replicache({
      name: `case-files-${boardId}`,
      licenseKey: import.meta.env.VITE_REPLICACHE_LICENSE_KEY,
      pushURL: `${BASE_API_URL}/replicache/push/${boardId}`,
      pullURL: `${BASE_API_URL}/replicache/pull/${boardId}`,
    });
    setRep(rep);
  }, [boardId]);

  return (
    <ReplicacheContextProvider value={{ rep }}>
      {children}
    </ReplicacheContextProvider>
  );
};

export { ReplicacheProvider, useReplicache };

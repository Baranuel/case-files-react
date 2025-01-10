import { ReactNode, useEffect, useState } from "react";
import { createGenericContext } from "./genericContext";
import { ReplicacheContext } from "@/lib/replicache/types";
import { createReplicacheInstance } from "@/lib/replicache/create-instance";

type ReplicacheContextType =  ReplicacheContext

interface ReplicacheProviderProps {
  children: ReactNode;
  boardId: string;
}

const [useReplicache, ReplicacheContextProvider] =
  createGenericContext<ReplicacheContextType>();

const ReplicacheProvider = ({ children, boardId }: ReplicacheProviderProps) => {
  const [rep, setRep] = useState<ReplicacheContextType>();

  useEffect(() => {
    const rep = createReplicacheInstance(boardId);
    setRep(rep);

    return () => {
      rep.close();
    };
  }, [boardId]);

  if (!rep) {
    return 'loading'
  }

  return (
    <ReplicacheContextProvider value={rep}>
      {children}
    </ReplicacheContextProvider>
  );
};

export { ReplicacheProvider, useReplicache };

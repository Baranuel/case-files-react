import { ReactNode, useEffect, useState, useMemo } from "react";
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

  const memoizedValue = useMemo(() => rep, [rep]);

  if (!memoizedValue) {
    return <div>Loading...</div>
  }

  return (
    <ReplicacheContextProvider value={memoizedValue}>
      {children}
    </ReplicacheContextProvider>
  );
};

export { ReplicacheProvider, useReplicache };

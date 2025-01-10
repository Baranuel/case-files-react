import { useReplicache } from "@/app/providers/ReplicacheProvider";
import { getAllElements } from "@/lib/replicache/queries";
import { useEffect, useState } from "react";
import { useSubscribe } from "replicache-react";
import { Element } from "@/types";


export const useVisibleElements = () => {
    const {rep} = useReplicache();

    const elementsList = useSubscribe(rep, getAllElements, {
        default: [],
      });

    const [boardElements, setBoardElements] = useState<Element[]>([]);
    

    useEffect(() => {
        setBoardElements(elementsList);
    }, [elementsList]);

    return {boardElements, setBoardElements};
}
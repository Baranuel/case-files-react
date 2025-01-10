
import { ReadTransaction } from "replicache";
import { ELEMENTS_KEY } from "./constants";
import { Element } from "@/types";


export const getAllElements = async (tx: ReadTransaction) => {
    return ((await tx.scan({prefix: ELEMENTS_KEY}).entries().toArray()).map(([_, value]) => value)) as Element[]
}

export const getElement = async (tx: ReadTransaction, id: string) => {
    const key = `${ELEMENTS_KEY}${id}`;
    return await tx.get(key) as Element;
}

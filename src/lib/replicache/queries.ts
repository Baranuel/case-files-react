
import { ReadTransaction } from "replicache";
import { ELEMENTS_KEY } from "./constants";
import { Element } from "@/types";
import { BASE_URL } from "@/constants";


export const getAllElements = async (tx: ReadTransaction) => {
    // return ((await tx.scan({prefix: ELEMENTS_KEY}).entries().toArray()).map(([_, value]) => value)) as Element[]
    return [{
        id: "1",
        type: "person",
        position: {
            x1: 0,
            y1: 0,
            x2: 200,
            y2: 225
        },
        content: "This is a person",
        imageUrl: `${BASE_URL}/avatar-w.svg`,
        layer: 1,
        title: "John Doe"
    },{
        id: "2",
        type: "person",
        position: {
            x1: 100,
            y1: 100,
            x2: 300,
            y2: 325
        },
        content: "This is a person",
        imageUrl:`${BASE_URL}/avatar-m.svg`,
        layer: 1,
        title: "John Doe"
    }] as Element[]
}

export const getElement = async (tx: ReadTransaction, id: string) => {
    const key = `${ELEMENTS_KEY}${id}`;
    return await tx.get(key) as Element;
}

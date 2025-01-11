
import { ReadTransaction } from "replicache";
import { ELEMENTS_KEY } from "./constants";
import { Element } from "@/types";


export const getAllElements = async (tx: ReadTransaction) => {
    // return ((await tx.scan({prefix: ELEMENTS_KEY}).entries().toArray()).map(([_, value]) => value)) as Element[]
    return [{
        id: "1",
        type: "person",
        position: {
            x1: 0,
            y1: 0,
            x2: 100,
            y2: 100
        },
        content: "This is a person",
        imageUrl: 'https://fastly.picsum.photos/id/457/200/300.jpg?hmac=RK07I110orPDAIl8q1vdjOgPnPvEX278Jy74cgjosyo' ,
        layer: 1,
        title: "John Doe"
    },{
        id: "2",
        type: "person",
        position: {
            x1: 100,
            y1: 100,
            x2: 200,
            y2: 200
        },
        content: "This is a person",
        imageUrl:'/vite.svg',
        layer: 1,
        title: "John Doe"
    }] as Element[]
}

export const getElement = async (tx: ReadTransaction, id: string) => {
    const key = `${ELEMENTS_KEY}${id}`;
    return await tx.get(key) as Element;
}

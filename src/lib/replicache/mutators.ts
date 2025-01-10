
import type { MutatorDefs } from "replicache";
import type { Element } from "@/types";
import { ELEMENTS_KEY } from "./constants";

export const mutators: MutatorDefs = {
    create_element: async (tx, element: Element) => {
        const {id} = element;
        const key = `${ELEMENTS_KEY}${id}`;
        await tx.set(key, element);
    },

    update_element: async (tx, element: Partial<Element>) => {
        return element;
    },

    delete_element: async (tx, element: Element) => {
        return element;
    }
}
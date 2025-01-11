import { ElementType } from "@/types";
import { ShapeDefinition } from "../types";
import { person } from "./person";
import { line } from "./line";
import { location } from "./location";

export const config: Record<ElementType, ShapeDefinition > = {
    person,
    location,
    line
}
import { ElementType } from "./element";

export type ActionType = 'selecting' | 'moving' | 'drawing' | 'resizing'

export type Tool = ElementType | 'select' | null
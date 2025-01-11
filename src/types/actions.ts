import { ElementType } from "./element";

export type ActionType = 'selecting' | 'moving' | 'drawing'

export type Tool = ElementType | 'select' | null
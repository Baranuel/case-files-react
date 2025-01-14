import { ActionType, PositionWithinElement, Tool } from "@/types";


export const handleInferAction = (position: PositionWithinElement, tool: Tool): ActionType | null => {

    if(tool === 'select') {
        return position === 'inside' ? 'moving' : 'resizing';
    }

    if(tool === 'line') {
        return 'drawing';
    }

    return null

}
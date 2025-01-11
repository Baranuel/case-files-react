import { PositionWithinElement, Tool } from "@/types";


export const handleInferAction = (position: PositionWithinElement, tool: Tool) => {

    if(tool === 'select') {
        if(position === 'inside') {
            return 'moving';
        }
    }

    if(tool === 'line') {
        return 'drawing';
    }

    return null

}
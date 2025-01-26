import { useCallback } from "react";
import { moveCamera, panCamera, zoomAtPoint } from "../utils/convert-position";
import { useCanvas } from "@/app/providers/CanvasProvider";
import { Element } from "@/types";


export const useUpdateCamera = () => {

    const {setClientViewRef, canvasRef, clientViewRef} = useCanvas();
    const canvas = canvasRef.current;



    const handleWheel = useCallback((event: WheelEvent) => {
        if(!canvas) return;
        event.preventDefault();

        if(event.ctrlKey) {
            const ZOOM_SENSITIVITY = 20;
            const clampedDelta = Math.max(-ZOOM_SENSITIVITY, Math.min(ZOOM_SENSITIVITY, event.deltaY));

            const zoomFactor = Math.pow(0.99, clampedDelta);
            const zoomPointX = event.clientX - canvas.getBoundingClientRect().left 
            const zoomPointY = event.clientY - canvas.getBoundingClientRect().top
            setClientViewRef(prev => ({...prev, camera: zoomAtPoint(zoomPointX, zoomPointY, prev.camera, zoomFactor)}));
        } else {
            setClientViewRef(prev => ({...prev, camera: panCamera(event.deltaX, event.deltaY, prev.camera)}));
        }
        console.log(clientViewRef.current.camera);
    }, [canvas, setClientViewRef]);



    const handleFindElement = useCallback((element:Element) => {
        if(!canvas) return;
        const elementPosition = element.position;
        const elementX = elementPosition.x1;
        const elementY = elementPosition.y1;
        const elementWidth = elementPosition.x2 - elementPosition.x1;   
        const elementHeight = elementPosition.y2 - elementPosition.y1;
        const camera = clientViewRef.current.camera;

        const canvasWidth = canvas.getBoundingClientRect().width;
        const canvasHeight = canvas.getBoundingClientRect().height;

        const zoomFactor = 0.6;

        const middleX = elementX + elementWidth / 2;
        const middleY = elementY + elementHeight / 2;

        const bufferRight = 300;
        const bufferBottom = middleY * 0.2;

        const pointXToMove = (middleX - bufferRight ) - (canvasWidth / zoomFactor )/2
        const pointYToMove = (middleY ) - (canvasHeight / zoomFactor )/2


        setClientViewRef(prev => ({...prev, selectedElement: element, camera:moveCamera( pointXToMove , pointYToMove, prev.camera, zoomFactor)}));
        console.log(clientViewRef.current.camera);
    }, [canvas, setClientViewRef]);

    

    



    return {handleWheel, handleFindElement};


}
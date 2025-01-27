import { Camera } from "../types";

/** This converts the mouse position to correct canvas position */
export const toCanvasPosition = (x1: number, y1: number, camera: Camera) => {
    return {
        x1: camera.x1 + x1 / camera.zoom,
        y1: camera.y1 + y1 / camera.zoom
    }
}

/** This converts the canvas position to device screen position */
export const toDevicePosition = (x1: number, y1: number, camera: Camera) => {
    return {
        x1: (x1 - camera.x1) * camera.zoom,
        y1: (y1 - camera.y1) * camera.zoom
    }
}

export const zoomAtPoint = (x1: number, y1: number , camera: Camera, zoomFactor: number): Camera => {
    const newZoom = camera.zoom * zoomFactor;
    const mouseWorldBefore = toCanvasPosition(x1, y1, camera);
    const mouseWorldAfter = toCanvasPosition(x1, y1, { ...camera, zoom: newZoom });
    const maxAllowedZoom = 0.15;
    if(newZoom < maxAllowedZoom) return camera;

    const zoomX1 = camera.x1 + (mouseWorldBefore.x1 - mouseWorldAfter.x1);
    const zoomY1 = camera.y1 + (mouseWorldBefore.y1 - mouseWorldAfter.y1);
    
    return {
        zoom: Math.max(maxAllowedZoom, newZoom),
        x1: zoomX1,
        y1: zoomY1,
        animateCameraTo: {...camera, x1: zoomX1, y1: zoomY1, zoom: newZoom, applyEase:false}
    };
}

export const panCamera = (deltaX: number, deltaY: number, camera: Camera, reverse: boolean = false): Camera => {

    const x1 = reverse ? camera.x1 - deltaX / camera.zoom : camera.x1 + deltaX / camera.zoom;
    const y1 = reverse ? camera.y1 - deltaY / camera.zoom : camera.y1 + deltaY / camera.zoom;
    return {
        ...camera,
        x1,
        y1,
        animateCameraTo: {...camera, x1, y1, applyEase:false}
    }
}


export const moveCamera = (x1: number, y1: number, camera: Camera, zoom:number = 1): Camera => {
 
    return {
        ...camera,
        animateCameraTo: {
        zoom,
        x1,
        y1,
        applyEase: true
    }
    }
}

// Add new utility object
export const CameraUtils = {
    createCamera: (zoom = 1, x1 = 0, y1 = 0): Camera => ({
        zoom,
        x1,
        y1,
    })
};
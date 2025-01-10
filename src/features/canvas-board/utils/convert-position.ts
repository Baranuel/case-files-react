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

    return {
        zoom: newZoom,
        x1: camera.x1 + (mouseWorldBefore.x1 - mouseWorldAfter.x1),
        y1: camera.y1 + (mouseWorldBefore.y1 - mouseWorldAfter.y1),
    };
}

export const panCamera = (deltaX: number, deltaY: number, camera: Camera): Camera => {
    return {
        ...camera,
        ...toCanvasPosition(deltaX, deltaY, camera)
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

export type Camera = {
    x1: number;
    y1: number;
    zoom: number;
    animateCameraTo?: Camera & {applyEase?: boolean};
}
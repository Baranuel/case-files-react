import { useCanvas } from "@/app/providers/CanvasProvider";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { useCanvasEvents } from "../hooks/use-canvas-events";
import { useUpdateCamera } from "../hooks/use-update-camera";
import { renderCanvas } from "../utils/canvas-rendering/handle-render-canvas";
import { useImageCache } from "../hooks/use-image-cache";

export const Canvas = () => {

  const { clientViewRef,  canvasRef, elementsList, } = useCanvas();
  const { cacheLoaded } = useImageCache(elementsList);
  const { handleMouseDown, handleMouseUp, handleMouseMove, handleMouseLeave, handleKeyDown, handleKeyUp } = useCanvasEvents();
  const { handleWheel } = useUpdateCamera();
  

  const handleRenderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const clientView = clientViewRef.current;
    
    if (!canvas || !clientView) return;
    const {camera, elements, ghostElement} = clientView;

    renderCanvas(canvas, camera, elements, ghostElement);
    requestAnimationFrame(handleRenderCanvas);
  }, [canvasRef, clientViewRef, cacheLoaded]);

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(handleRenderCanvas);
    return () => cancelAnimationFrame(frame);
  }, [handleRenderCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("wheel", handleWheel);
    window.addEventListener("resize", handleRenderCanvas);
    window.addEventListener("keydown", (e) => handleKeyDown(e, canvas));
    window.addEventListener("keyup", (e) => handleKeyUp(e, canvas));
    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", handleRenderCanvas);
      window.removeEventListener("keydown", e => handleKeyDown(e, canvas));
      window.removeEventListener("keyup", (e) => handleKeyUp(e, canvas));
    };
  }, [canvasRef, handleWheel, handleRenderCanvas, handleKeyDown, handleKeyUp]);

  const canvasProps = useMemo(
    () => ({
      className: "bg-[#2C2420] w-full h-full",
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
      ref: canvasRef,
    }),
    [handleMouseDown, handleMouseUp, handleMouseMove, handleMouseLeave]
  );

  return <canvas {...canvasProps} />;
};

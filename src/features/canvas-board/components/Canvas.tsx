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
  const { visibleElements, canvasRef, camera } = useCanvas();
  const { cacheLoaded } = useImageCache(visibleElements);
  const { handleMouseDown, handleMouseUp, handleMouseMove, handleMouseLeave } = useCanvasEvents();
  const { handleWheel } = useUpdateCamera();

  const handleRenderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    renderCanvas(canvas, camera, visibleElements);
  }, [canvasRef, camera, visibleElements, cacheLoaded]);

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(handleRenderCanvas);
    return () => cancelAnimationFrame(frame);
  }, [handleRenderCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.addEventListener("wheel", handleWheel);
    window.addEventListener("resize", handleRenderCanvas);

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", handleRenderCanvas);
    };
  }, [canvasRef, handleWheel, handleRenderCanvas]);

  const canvasProps = useMemo(
    () => ({
      className: "bg-neutral-900 w-full h-full rounded-lg shadow-lg",
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

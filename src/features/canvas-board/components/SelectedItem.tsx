import type { Element } from "@/types";
import { useCanvas } from "@/app/providers/CanvasProvider";
import { Folder } from "./Folder/Folder";
import { PaperLayers } from "./Folder/PaperLayers";
import { ElementType } from "@/types";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { useQuery, useZero } from "@rocicorp/zero/react";
import { Content, ZeroSchema } from "@/schema";
import { ImagePicker } from "./SelectedItem/ImagePicker";
import { MarkdownEditor } from "./MarkdownEditor/MarkdownEditor";
import { useDebouncedCallback } from "use-debounce";
import { InputMapper } from "./SelectedItem/InputMapper";

export function SelectedItem() {
  const { clientViewRef, previewElementId } = useCanvas();
  const clientView = clientViewRef.current;
  const z = useZero<ZeroSchema>();

  if (!clientView) return null;

  const [element] = useQuery(z.query.element.where('id', '=', previewElementId!).related('content').one());

  const [previewElement, setPreviewElement] = useState<Element | null>(
    element || null
  );
  const containerRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    if (element) {
      setPreviewElement(element);
    }
  }, [element]);

  const getTitle = (type: ElementType | undefined) => {
    if (!type) return "Selected Item";
    if (type === "person") return "Suspect";
    if (type === "location") return "Location";
  };


  const handleDebouncedUpdateElement = useDebouncedCallback(
    (updateProperty: Partial<Record<keyof Content, any>>) => {
      if (!previewElement?.contentId) return;

      z.mutate.content.update({
        id: previewElement.contentId!,
        ...updateProperty,
      });
    },
    900
  );


  const scrollToBottom = () => {
    if (!containerRef.current) return;
    const scrollHeight = containerRef.current.getBoundingClientRect().bottom;
    containerRef.current.scrollTo(0, scrollHeight);
  };




  const mainContent = (
    <div className="flex flex-col h-full py-2">
      <h1 className="text-2xl font-bold text-[#8B4513] mb-2"> {getTitle(element?.type)} #{element?.id.slice(-5, -1)}</h1>
      <InputMapper element={element} />
    </div>
  );

  return (
    <div
      style={{ viewTransitionName: "selected-item-wrapper" }}
      className={`absolute top-[7%] -translate-x-[90%] min-w-[400px] w-fit-content h-[90%] ${
        !previewElementId ? "rotate-[4deg]" : "rotate-0"
      }`}
    >
      <div className="z-20 flex min-w-[400px] w-[10vw] h-full relative">
        <Folder isOpen={!!element?.id} />
        <PaperLayers ref={containerRef} isOpen={!!element?.id}>
          {!!element?.id && mainContent}
        </PaperLayers>
      </div>
    </div>
  );
}

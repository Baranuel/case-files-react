import type { Element } from "@/types";
import { useCanvas } from "@/app/providers/CanvasProvider";
import { Folder } from "./Folder/Folder";
import { PaperLayers } from "./Folder/PaperLayers";
import { ElementType } from "@/types";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { useZero } from "@rocicorp/zero/react";
import { Content, ZeroSchema } from "@/schema";
import { ImagePicker } from "./ImagePicker";
import { MarkdownEditor } from "./MarkdownEditor/MarkdownEditor";
import { useDebouncedCallback } from "use-debounce";

export function SelectedItem() {
  const { clientViewRef, previewElementId, elementsList } = useCanvas();
  const clientView = clientViewRef.current;

  if (!clientView) return null;

  const element = elementsList.find((el) => el.id === previewElementId);
  const [previewElement, setPreviewElement] = useState<Element | null>(element || null);
  const [elContent, setElContent] = useState<Content | null>( null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const z = useZero<ZeroSchema>();

  useEffect(() => {
    if (element) {
      setPreviewElement(element);
      setElContent(element.content?.[0] ?? null);
    }
  }, [element]);

  const getTitle = (type: ElementType | undefined) => {
    if (!type) return "Selected Item";
    if (type === "person") return "Suspect";
    if (type === "location") return "Location";
  };

  const handleImageSelect = (imageUrl: string) => {
    z.mutate.element.update({
      id: element?.id,
      imageUrl,
    });
  };

  const handleDebouncedUpdateElement = useDebouncedCallback((updateProperty: Partial<Record<keyof Content, string>>) => {
    if (!previewElement?.contentId) return;

    z.mutate.content.update({
      id: previewElement.contentId,
      ...updateProperty
    });
  }, 900);


  const scrollToBottom = () => {
    if (!containerRef.current) return;
    const scrollHeight = containerRef.current.getBoundingClientRect().bottom;
    containerRef.current.scrollTo(0, scrollHeight);
  };

  const mainContent = (
    <>
      <h1 className="text-2xl font-bold text-[#8B4513] mb-2">
        {getTitle(element?.type)} #{element?.id.slice(-5, -1)}
      </h1>
      <ImagePicker
        imageUrl={element?.imageUrl ?? undefined}
        onSelect={handleImageSelect}
        elementsList={elementsList}
      />

      <div className="flex gap-4 my-2 p-3 bg-[#ECD5B8] rounded-lg">
        <div className="flex flex-col grow">
          <label htmlFor="name" className="mb-2">
            <span className="text-sm font-bold text-[#8B4513]">Name</span>
          </label>
          <input
            name="name"
            onChange={(e) => {
              setElContent(prev => prev ? ({ ...prev, title: e.target.value }) : null);
              handleDebouncedUpdateElement({ title: e.target.value });
            }}
            value={elContent?.title ?? ""}
            type="text"
            placeholder="Name"
            className="w-full px-4 py-2 rounded-lg border border-[#D4B492] bg-[#FFF0DF] text-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#B4540A]"
          />
        </div>
      </div>

      <div className="flex gap-4 my-2 p-3 bg-[#ECD5B8] rounded-lg">
        <div className="flex flex-col grow h-full">
          <label className="mb-2">
            <span className="text-sm font-bold text-[#8B4513]">Notes</span>
          </label>
          <MarkdownEditor
            previewId={previewElementId}
            markdown={element?.content?.[0].content ?? ""}
            onChange={(content) => {
              // Ensure empty lines are preserved by replacing them with a line break character
              const preservedContent = content
              setElContent(prev => prev ? ({ ...prev, content:preservedContent }) : null);
              handleDebouncedUpdateElement({ content:preservedContent });
              scrollToBottom();
            }}
          />
        </div>
      </div>
    </>
  );

  return (
    <div
      style={{ viewTransitionName: "selected-item-wrapper" }}
      className={`absolute top-[7%] -translate-x-[90%] min-w-[400px] w-fit-content h-[90%] ${
        !previewElementId ? "rotate-[4deg]" : "rotate-0"
      }`}
    >
      <div className="z-20 flex min-w-[400px] w-[10vw] h-full relative">
        <Folder isOpen={!!previewElementId} />
        <PaperLayers ref={containerRef} isOpen={!!previewElementId}>
          {!!previewElementId && mainContent}
        </PaperLayers>
      </div>
    </div>
  );
}

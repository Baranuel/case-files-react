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
import { DatePicker, Switch } from "antd";
import dayjs from "dayjs";

export function SelectedItem() {
  const { clientViewRef, previewElementId, elementsList } = useCanvas();
  const clientView = clientViewRef.current;

  if (!clientView) return null;

  const element = elementsList.find((el) => el.id === previewElementId);
  const [previewElement, setPreviewElement] = useState<Element | null>(
    element || null
  );
  const [elContent, setElContent] = useState<Content | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const z = useZero<ZeroSchema>();

  useEffect(() => {
    if (element) {
      setPreviewElement(element);
      setElContent(element.content ?? null);
    }
  }, [element]);

  const getTitle = (type: ElementType | undefined) => {
    if (!type) return "Selected Item";
    if (type === "person") return "Suspect";
    if (type === "location") return "Location";
  };

  const handleImageSelect = (imageUrl: string) => {
    z.mutate.element.update({
      id: element?.id!,
      imageUrl,
    });
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

  const handleUpdateElement = (
    updateProperty: Partial<Record<keyof Content, any>>
  ) => {
    if (!previewElement?.contentId) return;

    z.mutate.content.update({
      id: previewElement.contentId!,
      ...updateProperty,
    });
  };

  const scrollToBottom = () => {
    if (!containerRef.current) return;
    const scrollHeight = containerRef.current.getBoundingClientRect().bottom;
    containerRef.current.scrollTo(0, scrollHeight);
  };


  const renderSelectableSection = () => {
    if (element?.type !== "person") return (
        <div className="p-3 rounded-lg w-full mb-2">
          <ImagePicker
          imageUrl={element?.imageUrl ?? undefined}
          onSelect={handleImageSelect}
          elementsList={elementsList}
          element={element}
          nonSelectable={true}
          />
      </div>
  )

    return <div className="rounded-lg w-full">
        <ImagePicker
          imageUrl={element?.imageUrl ?? undefined}
          onSelect={handleImageSelect}
          elementsList={elementsList}
          element={element}
      />

      <div className="space-y-2 my-2">
        <div className="flex gap-3">
          <div className="p-3 bg-[#ECD5B8] rounded-lg w-full">
            <div className="flex flex-col gap-2 items-start justify-between h-full">
              <label
                htmlFor="victim"
                className="block font-bold text-[#8B4513] mb-2"
              >
                Person is victim
              </label>
              <Switch
                onChange={(checked) => handleUpdateElement({ victim: checked })}
                checked={elContent?.victim!}
              />
            </div>
          </div>

          <div className="p-3 bg-[#ECD5B8] rounded-lg w-full ">
            <div>
              <label
                htmlFor="timeOfDeath"
                className={`block font-bold text-[#8B4513] mb-2 ${!elContent?.victim ? "opacity-50" : ""}`}
              >
                Time of Death
              </label>
              <DatePicker
                showTime
                defaultPickerValue={dayjs().year(1890)}
                disabled={!element?.content?.victim}
                id="timeOfDeath"
                value={
                  element?.content?.timeOfDeath
                    ? dayjs.unix(element?.content?.timeOfDeath)
                    : null
                }
                onChange={(date) =>
                  handleUpdateElement({ timeOfDeath: date?.unix() })
                }
                allowClear={false}
                format="MMM DD - HH:mm"
                picker="date"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  }

  const mainContent = (
    <>
      <h1 className="text-2xl font-bold text-[#8B4513] mb-2">
        {getTitle(element?.type)} #{element?.id.slice(-5, -1)}
      </h1>

      {renderSelectableSection()}

      <div className="flex flex-col gap-2 my-2">
        <div className="p-3 bg-[#ECD5B8] rounded-lg">
          <label
            htmlFor="name"
            className="block text-sm font-bold text-[#8B4513] mb-2"
          >
            Name
          </label>
          <input
            name="name"
            onChange={(e) => {
              setElContent((prev) =>
                prev ? { ...prev, title: e.target.value } : null
              );
              handleDebouncedUpdateElement({ title: e.target.value });
            }}
            value={elContent?.title ?? ""}
            type="text"
            placeholder="Name"
            className="w-full px-4 py-2 rounded-lg border border-[#D4B492] bg-[#FFF0DF] text-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#B4540A] placeholder:text-[#8B4513]/50"
          />
        </div>

        <div className="p-3 bg-[#ECD5B8] rounded-lg">
          <label className="block text-sm font-bold text-[#8B4513] mb-2">
            Notes
          </label>
          <MarkdownEditor
            previewId={previewElementId}
            markdown={element?.content?.notes ?? ""}
            onChange={(content) => {
              const preservedContent = content;
              setElContent((prev) =>
                prev ? { ...prev, notes: preservedContent } : null
              );
              handleDebouncedUpdateElement({ notes: preservedContent });
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

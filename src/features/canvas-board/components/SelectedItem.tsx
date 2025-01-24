import type { Element } from "@/types";
import { useCanvas } from "@/app/providers/CanvasProvider";
import { Folder } from "./Folder/Folder";
import { PaperLayers } from "./Folder/PaperLayers";
import { ElementType } from "@/types";
import { BASE_URL } from "@/constants";
import { useEffect } from "react";
import { useState, use } from "react";
import { useZero } from "@rocicorp/zero/react";
import { ZeroSchema } from "@/schema";
import { getAvailablePickerImages } from "@/utils/bucket";
import { ImagePicker } from "./ImagePicker";

export function SelectedItem() {
  const { clientViewRef, previewElementId, elementsList } = useCanvas();
  const clientView = clientViewRef.current;



  if (!clientView) return null;

  const element = elementsList.find((el) => el.id === previewElementId);
  const [previewElement, setPreviewElement] = useState<Element | null>(element || null);
  
  const isRemoteImage = element?.imageUrl?.startsWith('http');
  const imageUrl = isRemoteImage ? element?.imageUrl : `${BASE_URL}/${element?.imageUrl}`;

  const z = useZero<ZeroSchema>();



  useEffect(() => {
    if (element) {
      setPreviewElement(element);
    }
  }, [element]);

  
  
  useEffect(() => {
    const images = getAvailablePickerImages().then( images => console.log(images))
    console.log(images);
  }, [element]);

  const getTitle = (type: ElementType | undefined) => {
    if (!type) return "Selected Item";
    if (type === "person") return "Suspect";
    if (type === "location") return "Location";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if(!element?.contentId) return;

    const { name, value } = e.target;
    z.mutate.content.update({
      id: element?.contentId,
      title: value
    });
  };

  const mainContent = (
    <>
      <h1 className="text-2xl font-bold text-[#8B4513] mb-6">
        {getTitle(element?.type)} #{element?.id.slice(-5, -1)}
      </h1>

      <div className="flex gap-4 my-2 p-2 bg-[#ECD5B8] rounded-lg">
        <div className="w-full h-full max-w-[150px] max-h-[150px]">
        <ImagePicker imageUrl={imageUrl ?? undefined} onSelect={() => {}} onClose={() => {}} />
        </div>
        <div className="flex flex-col ">
          <h3 className="text-sm font-bold text-[#8B4513]">Name</h3>
          <p className="text-base text-[#8B4513]">
            {element?.content?.[0].title}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-[#ECD5B8] p-4 rounded-lg border border-[#D4B492]">
          <label className="block text-[#8B4513] text-sm font-bold mb-2">
            Case Title
          </label>
          <input
            type="text"
            className="w-full bg-[#F5E6D3] text-[#8B4513] p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#D4B492] border border-[#D4B492]"
            placeholder="Enter case title..."
            value={element?.content?.[0].title}
            onChange={handleInputChange}
          />
        </div>

        <div className="bg-[#ECD5B8] p-4 rounded-lg border border-[#D4B492]">
          <label className="block text-[#8B4513] text-sm font-bold mb-2">
            Description
          </label>
          <textarea
            className="w-full bg-[#F5E6D3] text-[#8B4513] p-2 rounded h-24 focus:outline-none focus:ring-2 focus:ring-[#D4B492] border border-[#D4B492]"
            placeholder="Enter case description..."
          />
        </div>

        <div className="bg-[#ECD5B8] p-4 rounded-lg border border-[#D4B492]">
          <label className="block text-[#8B4513] text-sm font-bold mb-2">
            Priority
          </label>
          <div className="flex gap-4">
            <button className="bg-[#F5E6D3] px-4 py-2 rounded text-[#8B4513] hover:bg-[#E8D1B9] border border-[#D4B492]">
              Low
            </button>
            <button className="bg-[#F5E6D3] px-4 py-2 rounded text-[#8B4513] hover:bg-[#E8D1B9] border border-[#D4B492]">
              Medium
            </button>
            <button className="bg-[#F5E6D3] px-4 py-2 rounded text-[#8B4513] hover:bg-[#E8D1B9] border border-[#D4B492]">
              High
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div
      style={{ viewTransitionName: "selected-item-wrapper" }}
      className={` absolute top-[7%] -translate-x-[90%] min-w-[400px] w-fit-content h-[90%]   ${
        !previewElementId ? "rotate-[4deg]" : "rotate-0"
      }`}
    >
      <div className={` z-20 flex min-w-[400px] w-[10vw] h-full relative`}>
        <Folder isOpen={!!previewElementId} />
        <PaperLayers isOpen={!!previewElementId}>{mainContent}</PaperLayers>
      </div>
    </div>
  );
}

import type { Element } from "@/types";
import { useCanvas } from "@/app/providers/CanvasProvider";
import { Folder } from "./Folder/Folder";
import { PaperLayers } from "./Folder/PaperLayers";
import { ElementType } from "@/types";
import { useQuery, useZero } from "@rocicorp/zero/react";
import { ZeroSchema } from "@/schema";

import { InputMapper } from "./SelectedItem/InputMapper";

export function SelectedItem() {
  const { clientViewRef, previewElementId } = useCanvas();
  const clientView = clientViewRef.current;
  const z = useZero<ZeroSchema>();

  if (!clientView) return null;

  const [element] = useQuery(z.query.element.where('id', '=', previewElementId!).related('content').one());



  const getTitle = (type: ElementType | undefined) => {
    if (!type) return "Selected Item";
    if (type === "person") return "Suspect";
    if (type === "location") return "Location";
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
        <PaperLayers  isOpen={!!element?.id}>
          {!!element?.id && mainContent}
        </PaperLayers>
      </div>
    </div>
  );
}

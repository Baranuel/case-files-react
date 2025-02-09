import type { Element } from "@/types";
import { useCanvas } from "@/app/providers/CanvasProvider";
import { Folder } from "./Folder/Folder";
import { PaperLayers } from "./Folder/PaperLayers";
import { ElementType } from "@/types";
import { useQuery, useZero } from "@rocicorp/zero/react";
import { ZeroSchema } from "@/schema";

import { InputMapper } from "./SelectedItem/InputMapper";
import { AnimatePresence, motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full py-2"
    >
      <h1 className="text-2xl font-bold text-[#8B4513] mb-2"> {getTitle(element?.type)} #{element?.id.slice(-5, -1)}</h1>
      <InputMapper element={element} />
    </motion.div>
  );

  return (
    <motion.div
      animate={{
        rotate: !previewElementId ? 4 : 0,
        translateX: !previewElementId ? '-90%' : '-85%',
        transition: {
          duration: 0.3,
          ease: "easeInOut",
        },
      }}
      className={`absolute top-[4%]  min-w-[400px] w-fit-content h-[90%]`}
    >
      <div className="z-50 flex min-w-[400px] w-[10vw] h-full relative">
        <Folder isOpen={!!element?.id} />
        <PaperLayers  isOpen={!!element?.id}>
          <AnimatePresence> 

          {!!element?.id && mainContent}
          </AnimatePresence>
        </PaperLayers>
      </div>
    </motion.div>
  );
}

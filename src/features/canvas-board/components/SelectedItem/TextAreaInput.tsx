
import { Content, Element, ZeroSchema } from "@/schema";
import { useZero } from "@rocicorp/zero/react";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
export const TextAreaInput = ({element}: {element: Element & {content: Content}}) => {
    
    const [value, setValue] = useState<string>("");
    const z = useZero<ZeroSchema>();
    useEffect(() => {
      setValue(element.content?.notes ?? "");
    }, [element]);
  
  
  
    const handleDebouncedUpdateElement = useDebouncedCallback(
      (updateProperty: Partial<Record<keyof Content, any>>) => {
        if (!element?.contentId) return;
  
        z.mutate.content.update({
          id: element.contentId!,
          ...updateProperty,
        });
      },
      900
    );
    

    return (
        <div className="flex flex-col gap-2 h-full bg-[#ECD5B8] rounded-lg px-4 py-3">
            <label className="text-sm font-bold text-[#8B4513]">Notes</label>
            <TextArea className=" rounded-lg flex-1 p-4 text-xl"  value={value} onChange={(e) => {
                setValue(e.target.value);
                handleDebouncedUpdateElement({
                    notes: e.target.value
                });
            }} />
        </div>
    )
}
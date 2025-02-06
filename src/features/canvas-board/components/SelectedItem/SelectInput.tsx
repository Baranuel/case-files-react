import { Content, ZeroSchema } from "@/schema";
import { Element } from "@/types/element";
import { useZero } from "@rocicorp/zero/react";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export const SelectInput = ({ element }: { element: Element & {content: Content} | undefined }) => {
  if (!element) return null;
  const z = useZero<ZeroSchema>();

  const [elContent, setElContent] = useState<Content | null>(null);

  useEffect(() => {
    setElContent(element.content ?? null);
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
  );
};

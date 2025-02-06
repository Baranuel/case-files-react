import { Content, Element } from "@/schema";
import { MarkdownEditor } from "../MarkdownEditor/MarkdownEditor";

export const MarkdownInput = ({
  element,
}: {
  element: Element & { content: Content };
}) => {
  if (!element) return null;

  return (
    <div className="p-3 bg-[#ECD5B8] h-full rounded-lg flex flex-col mb-4">
      <label className="block text-sm font-bold text-[#8B4513] mb-2">
        Notes
      </label>
      <MarkdownEditor element={element as Element & { content: Content }} />
    </div>
  );
};

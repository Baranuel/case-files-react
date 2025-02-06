import {
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  thematicBreakPlugin,
  headingsPlugin,
  type MDXEditorMethods,
  frontmatterPlugin,
  toolbarPlugin,
  InsertThematicBreak,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Element, Content } from "@/schema";
import { useZero } from "@rocicorp/zero/react";
import { ZeroSchema } from "@/schema";
import { useDebouncedCallback } from "use-debounce";

export function MarkdownEditor({
  element,
}: {
  element: Element & { content: Content };
}) {
  const abortController = new AbortController();
  const editorRef = useRef<MDXEditorMethods>(null);
  const itemContentParent = document.getElementById("selected-item-content");
  const z = useZero<ZeroSchema>();
  const { content } = element;

  const [innerValue, setInnerValue] = useState(content.notes ?? "");

  const handleDebouncedUpdateElement = useDebouncedCallback((value: string) => {
    if (!element?.contentId) return;

    z.mutate.content.update({
      id: content.id,
      notes: value,
    });
  }, 900);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setMarkdown(content.notes ?? "");
    }
  }, [element.id]);



  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && itemContentParent) {
        itemContentParent.scrollTo({
          top: itemContentParent.scrollHeight + 100,
          behavior: "smooth"
        });
      }
    };

    if (editorRef.current) {
      window.addEventListener("keydown", handleKeyDown, { signal: abortController.signal });
    }

    return () => abortController.abort();
  }, [innerValue]);

  const editor = useMemo(() => {
    return (
      <MDXEditor
        className="bg-[#FFF0DF] flex-1 "
        ref={editorRef}
        onChange={(value) => {
          setInnerValue(value);
          handleDebouncedUpdateElement(value);
        }}
        contentEditableClassName="prose min-h-[250px]  text-xl px-4 "
        markdown={innerValue}
        plugins={[
          thematicBreakPlugin(),
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          markdownShortcutPlugin(),
        ]}
      />
    );
  }, [content]);

  return editor;
}

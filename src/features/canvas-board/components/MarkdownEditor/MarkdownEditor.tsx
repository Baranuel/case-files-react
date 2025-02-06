import {
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  thematicBreakPlugin,
  headingsPlugin,
  type MDXEditorMethods,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Element, Content } from "@/schema";
import { useZero } from "@rocicorp/zero/react";
import { ZeroSchema } from "@/schema";

export function MarkdownEditor({
  element,
}: {
  element: Element & {content: Content};
}) {
  const editorRef = useRef<MDXEditorMethods>(null);
  const itemContentParent = document.getElementById("selected-item-content");
  const z = useZero<ZeroSchema>();
  const {content} = element;


  const handleChange = useCallback(
    (value: string) => {
      if(itemContentParent) {
        itemContentParent.scrollTo({
          top: itemContentParent.scrollHeight,
          behavior: 'smooth'
        });
      }
      z.mutate.content.update({
        id: content.id,
        notes: value,
      });
    },
    [content.id, itemContentParent]
  );

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setMarkdown(content.notes ?? "");
    }
  }, [element.id]);

  const editor = useMemo(() => {
    return (
      <MDXEditor
        className="bg-[#FFF0DF] flex-1 "
        ref={editorRef}
        onChange={handleChange}
        contentEditableClassName="prose min-h-[250px]  text-xl px-4 "
        markdown={content.notes ?? ""}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          linkPlugin(),
          markdownShortcutPlugin({
            quotes: true,
            headings: true,
            lists: true,
            blockquotes: true,
            thematicBreakPlugin: true,
          }),
        ]}
      />
    );
  }, [content]);

  return editor;
}

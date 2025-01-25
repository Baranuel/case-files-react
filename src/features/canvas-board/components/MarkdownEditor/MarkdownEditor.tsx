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
  
  export function MarkdownEditor({
    onChange,
    markdown,
    previewId
  }: {
    onChange: (content: string) => void;
    markdown: string;
    previewId: string | null
  }) {
    const editorRef = useRef<MDXEditorMethods>(null);
  
    const handleChange = useCallback(
      (value: string) => {
          onChange(value);
      },
      [ onChange]
    );
  
    useEffect(() => {
      if (editorRef.current) {
        editorRef.current.setMarkdown(markdown);
      }
    }, [previewId]);

    const editor = useMemo(() => {
      return (
          <MDXEditor
          className="bg-[#FFF0DF] max-h-full"
            ref={editorRef}
            onChange={handleChange}
            contentEditableClassName="prose min-h-[100px] px-4 py-2"
            markdown={markdown}
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
              }),
            ]}
          />
      );
    }, [markdown, onChange]);
  
    return editor;
  }
  
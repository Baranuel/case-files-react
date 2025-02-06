import { Element } from "@/types/element"
import { ImagePicker } from "./ImagePicker";
import { SelectInput } from "./SelectInput";
import { Content } from "@/schema";
import { MarkdownEditor } from "../MarkdownEditor/MarkdownEditor";
import { MarkdownInput } from "./MarkdownInput";
import { TextAreaInput } from "./TextAreaInput";
import { VictimPicker } from "./VictimPicker";
export const InputMapper = ({element}: {element: Element | undefined}) => {
    if(!element) return null;
    const {type} = element;

    switch(type) {
        case 'person':
            return <div className="flex flex-col gap-2 flex-1 ">
            <ImagePicker element={element} />
            <VictimPicker element={element as Element & {content: Content}} />
            <SelectInput element={element as Element & {content: Content}} />
            <MarkdownInput element={element as Element & {content: Content}} />
            </div>
        case 'location':
            return <div className="flex flex-col gap-2 flex-1 ">
            <SelectInput element={element as Element & {content: Content}} />
            <MarkdownInput element={element as Element & {content: Content}} />
            </div>
        case 'note':
            return <div className="flex flex-col gap-2 flex-1 ">
            <TextAreaInput element={element as Element & {content: Content}} />
            </div>
    }
}

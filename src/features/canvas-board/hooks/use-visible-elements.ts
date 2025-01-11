import { useCallback, useState } from "react";
import { useEffect } from "react";
import { Element } from "@/types/element";

export const useVisibleElements = (elementsList: Element[]) => {
  const [visibleElements, setVisibleElements] = useState<Element[]>(elementsList);

  useEffect(() => {
    setVisibleElements(elementsList);
  }, [elementsList]);



  return { visibleElements, setVisibleElements };
};
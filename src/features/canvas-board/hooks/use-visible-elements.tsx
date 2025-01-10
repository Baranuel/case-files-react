import { useEffect, useState } from "react";
import { Element } from "@/types";

export const useVisibleElements = (elements: Element[]) => {
  const [boardElements, setBoardElements] = useState<Element[]>(elements);

  useEffect(() => {
    setBoardElements(elements);
  }, [elements]);

  return { boardElements, setBoardElements };
};

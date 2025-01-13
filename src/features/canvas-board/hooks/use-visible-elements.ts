import {  useState } from "react";
import { useEffect } from "react";
import { Element } from "@/types/element";

export const useVisibleElements = (elementsList: Element[]) => {
  
  const [visibleElements, setVisibleElements] = useState<Element[]>(elementsList);

  const isDifferent = visibleElements.length !== elementsList.length
  
  useEffect(() => { 
    if(!isDifferent) return
    setVisibleElements(elementsList)
  }, [elementsList]);



  return { visibleElements:visibleElements, setVisibleElements };
};
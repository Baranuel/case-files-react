
export type ShapeDefinition= {
    minWidth: number;
    minHeight: number;
} 


export type LocationDefinition = ShapeDefinition & {
    color:string,
    padding:number;
    gap:number;
    polaroidBgColor:string;
    textColor:string;
}

export type PersonDefinition = ShapeDefinition & {
    color:string,
    padding:number;
    gap:number
}

export type NoteDefinition = ShapeDefinition & {
    color:string,
    padding:number;
}


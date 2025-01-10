
export interface ViewTransition {
    startViewTransition: (callback: () => void) => void;
}


declare global {
    interface Document {
        startViewTransition: (callback: () => void) => void;
    }
}
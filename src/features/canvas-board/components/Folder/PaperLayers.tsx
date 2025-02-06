import { useCanvas } from "@/app/providers/CanvasProvider";
import { cn } from "@/utils/cn";

interface PaperLayersProps {
  isOpen: boolean;
  children: React.ReactNode;
}

export const PaperLayers = ({ isOpen, children}: PaperLayersProps) => {
  const { setPreviewElementId} = useCanvas()
  return (
    <>
      <div
      id="selected-item-content"
        style={{
          viewTransitionName: "selected-item",
          transitionDuration: "0.3s",
          zIndex: 0,
        }}
        className={cn(
          `bg-[#F5E6D3] absolute w-full p-4 h-[92%] top-[4%] z-0 border border-[#D4B492]  overflow-auto `,
          !isOpen ? `translate-x-[2%]` : "translate-x-[95%]"
        )}
      >
        {children}
      </div>

      <div
        style={{
          transitionDuration: "0.3s",
          viewTransitionName: "selected-item-paper-layers",
        }}
        className={cn(
          `bg-[#E4C18D] absolute w-[110%] h-[98%] top-[1%] rounded-lg -z-10 shadow-lg border border-[#D4B492] `,
          !isOpen ? `-translate-x-[5%]` : "translate-x-[82%]"
        )}
      >
        {/* Tab */}
        <div
          onClick={() => {
            if('startViewTransition' in document) {
              document.startViewTransition(() => {
                setPreviewElementId(null)
              })
            } else {
              setPreviewElementId(null)
            }
          }}
          className={cn(
            "absolute hover:cursor-pointer -right-8 top-8 w-8 h-24 bg-[#E4C18D] rounded-r-lg border-r border-t border-b border-[#C4A475] flex items-center justify-center"
          )}
        >
          <div className="w-1 h-16 bg-[#C4A475] rounded-full" />
        </div>
      </div>
    </>
  );
};

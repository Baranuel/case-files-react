import { cn } from "@/utils/cn";

interface PaperLayersProps {
  isOpen: boolean;
  children: React.ReactNode;
}

export const PaperLayers = ({
  isOpen,
  children,
}: PaperLayersProps) => {
  return (
    <>
      <div
        style={{
          viewTransitionName: "selected-item",
          transitionDuration: "0.3s",
          zIndex: 0,
        }}
        className={cn(
          `bg-[#F5E6D3] absolute w-full p-8 h-[97%] top-[1.5%] z-0 shadow-lg border border-[#D4B492]`,
          !isOpen ? `-translate-x-[33%]` : "translate-x-0",
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
          `bg-[#E4C18D] absolute w-full h-[98%] top-[1%] rounded-lg -z-10 shadow-lg border border-[#D4B492] `,
          !isOpen ? `-translate-x-[30%]` : "translate-x-2"
        )}
      />
    </>
  );
}; 
import { useCanvas } from "@/app/providers/CanvasProvider";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

interface PaperLayersProps {
  isOpen: boolean;
  children: React.ReactNode;
}

export const PaperLayers = ({ isOpen, children}: PaperLayersProps) => {
  const { setPreviewElementId} = useCanvas()
  return (
    <>
      <motion.div
        animate={{
          translateX: !isOpen ? `2%` : `95%`,
          transition: {
            duration: 0.3,
            ease: "easeInOut",
          },
        }}
        className={cn(
          `bg-[#F5E6D3] absolute w-full p-4 h-[92%] top-[4%] z-0 border border-[#D4B492]  overflow-auto `,
        )}
      >
        {children}
      </motion.div>

      <motion.div
        animate={{
          translateX: !isOpen ? `-5%` : `82%`,
          transition: {
            duration: 0.3,
            ease: "easeInOut",
          },
        }}
        className={cn(
          `bg-[#E4C18D] absolute w-[110%] h-[98%] top-[1%] rounded-lg -z-10 shadow-lg border border-[#D4B492] `,
        )}
      >
        {/* Tab */}
        <div
          onClick={() => {
          setPreviewElementId(null)
          }}
          className={cn(
            "absolute hover:cursor-pointer -right-8 top-8 w-8 h-24 bg-[#E4C18D] rounded-r-lg border-r border-t border-b border-[#C4A475] flex items-center justify-center"
          )}
        >
          <div className="w-1 h-16 bg-[#C4A475] rounded-full" />
        </div>
      </motion.div>
    </>
  );
};

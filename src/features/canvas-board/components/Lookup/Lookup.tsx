import { useCanvas } from "@/app/providers/CanvasProvider";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useUpdateCamera } from "../../hooks/use-update-camera";

export function Lookup() {
  const [isOpen, setIsOpen] = useState(false);
  const {handleFindElement} = useUpdateCamera();
  const [searchTerm, setSearchTerm] = useState("");

  const { elementsList, setPreviewElementId } = useCanvas();

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSearchTerm("");
  }, [setIsOpen]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const filteredElements = useMemo(() => elementsList.filter((element) => {
    const searchTermLowerCase = searchTerm.toLowerCase();
    if(element.type === 'line') return false;
    if (element.content?.[0].title.toLowerCase().includes(searchTermLowerCase)) return true;
    return false;
  }), [elementsList, searchTerm]);



  return (
    <motion.div
      animate={{
        x: isOpen ? "0" : "100%",
        transition: {
          duration: 0.55,
          ease: [0.06, 0.975, 0.195, 0.985],
        },
      }}
      onMouseLeave={handleClose}
      onMouseOver={handleOpen}
      className={cn(
        `absolute right-0 top-4 bg-[#F5DEB3] flex flex-col gap-2 w-[30vw] h-[35vh] min-w-[400px] p-4 rounded-r-lg rounded-bl-lg z-50 `
      )}
    >
      <div className=" hover:cursor-pointer absolute text-2xl top-0 -left-16 h-16 w-16 bg-[#E4C18D] border border-[#C4A475] rounded-l-lg flex items-center justify-center">
      <FaMagnifyingGlass className="text-[#8B4513] text-2xl" />
      </div>
      <div className="flex flex-col gap-1 ">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          className="w-full border border-[#C4A475] rounded-lg p-2 bg-[#FFF0DF] text-[#8B4513] placeholder:text-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#B4540A]"
        />
      </div>
      <div className="flex flex-col gap-2 overflow-y-auto bg-[#FFF0DF] p-2 rounded-lg h-full border border-[#C4A475]">

      {filteredElements.map((element) => (
          <div
          key={element.id}
          className="flex items-center gap-2 p-2 hover:cursor-pointer hover:bg-[#fabc75] rounded-lg"
          onClick={() => {
            handleFindElement(element)
          }}
          >
          <img src={element.imageUrl ?? ''} className="w-8 h-8 " alt="Image" />
          <div className="flex flex-col gap-1">
            <h2 className="text-[#8B4513] text-sm font-bold">{element.content?.[0].title}</h2>
          </div>
        </div>
      ))}
      </div>
    
    </motion.div>
  );
}

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { createPortal } from "react-dom";

type ImagePickerProps = {
  imageUrl?: string;
  onSelect: (imageUrl: string) => void;
  onClose: () => void;
};
export const ImagePicker = ({
  imageUrl,
  onSelect,
  onClose,
}: ImagePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const targetPortal = document.getElementById("image-picker-root");

  if (!imageUrl) {
    return <div>No image selected</div>;
  }

  if (!targetPortal) {
    return <div>No image picker root</div>;
  }

  return (
    <div className="w-full h-full">
      <img
        onClick={() => setIsOpen(!isOpen)}
        src={imageUrl}
        className="w-full h-full object-cover rounded-lg hover:cursor-pointer hover:opacity-80 hover:brightness-110 hover:bg-black/10 transition-all duration-300"
        alt="Image"
      />
      {createPortal(
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.dialog
              key="modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              open={isOpen}
              onClick={() => setIsOpen(false)}
              onClose={() => setIsOpen(false)}
              className="z-50 absolute top-0 left-0 w-screen h-screen flex justify-center items-center bg-transparent  backdrop-blur-sm"
            >
            {/** Background */}
              <div onClick={() => setIsOpen(false)} className="absolute top-0 left-0 w-full h-full bg-black/50 "></div>

              {/** Modal */}
              <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="z-50 p-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-[#ECD5B8] rounded-lg flex ">
            {/** Content */}
            <div className="flex gap-4 w-full ">

            {/** Image */}
            <div className="flex border border-[#D4B492] rounded-lg w-1/4 max-w-[250px] max-h-[250px]">
                <img
                  src={imageUrl}
                  className="w-full h-full object-cover"
                  alt="Image"
                  />
            </div>

            {/** Selection */}
            <div className="flex flex-col gap-4 bg-[#F5E6D3] p-4 rounded-lg border border-[#D4B492] grow">

            </div>

            </div>
              </motion.div>
            </motion.dialog>
          )}
        </AnimatePresence>,
            targetPortal
      )}
    </div>
  );
};

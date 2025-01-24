import { getAvailablePickerImages } from "@/utils/bucket";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IoIosCloseCircleOutline } from "react-icons/io";

type ImagePickerProps = {
  imageUrl?: string;
  onSelect: (imageUrl: string) => void;
};

const tabs = [
  {
    title: "All",
    value: "all",
  },
  {
    title: "Men",
    value: "men",
  },
  {
    title: "Women",
    value: "women",
  },
];

export const ImagePicker = ({ imageUrl, onSelect }: ImagePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageSelection, setImageSelection] = useState<string[] | null>(null);
  const targetPortal = document.getElementById("image-picker-root");
  const [activeTab, setActiveTab] = useState("all");

  const cdnUrl =
    import.meta.env.VITE_DIGITAL_OCEAN_BUCKET_CDN_URL! +
    "/" +
    import.meta.env.VITE_DIGITAL_OCEAN_BUCKET_IMAGES_PATH! +
    "/";

  const handleSelectImage = (imageUrl: string) => {
    onSelect(imageUrl);
    setIsOpen(false);
    setActiveTab("all");
  };

  const handleGetAllImages = useCallback(async () => {
    const images = await getAvailablePickerImages();
    const imageWithCdn = images.map((image) => cdnUrl + image);

    setImageSelection(imageWithCdn);
  }, []);

  
  const handleClose = () => {
    setIsOpen(false);
    setActiveTab("all");
  };
  
  if (!imageUrl) {
    return <div>No image selected</div>;
  }
  
  if (!targetPortal) {
    return <div>No image picker root</div>;
  }
  
  const renderImages = () => {
    return imageSelection?.map((image) => (
      <div
      key={image}
      onClick={() => handleSelectImage(image)}
      className=" hover:cursor-pointer hover:scale-105 transition-all duration-200  w-full flex flex-col bg-[#F5E6D3] rounded-lg border border-[#D4B492] overflow-hidden shadow-md"
      >
        <img
          src={image}
          alt="Image"
          loading="lazy"
          className=" w-full h-full aspect-[1/1.1] object-cover hover:scale-105 transition-all duration-200 "
          />
      </div>
    ));
  };
  
  
  useEffect(() => {
    handleGetAllImages();
  }, []);

  return (
    <>
      <img
        onClick={() => setIsOpen(!isOpen)}
        src={imageUrl}
        className="h-[150px] aspect-square object-contain rounded-lg hover:cursor-pointer hover:opacity-80 hover:brightness-110 hover:bg-black/10 transition-all duration-300"
        alt="Image"
      />
      {createPortal(
        <AnimatePresence propagate>
          {isOpen && (
            <motion.dialog
              key="modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              open={isOpen}
              onClose={handleClose}
              className="z-50 absolute top-0 left-0 w-screen h-screen flex justify-center items-center bg-transparent  backdrop-blur-sm"
            >
              {/** Background */}
              <div
                onClick={handleClose}
                className="absolute top-0 left-0 w-full h-full bg-black/50 "
              />
              {/** Modal */}
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                onAnimationComplete={() => {
                  console.log("animation complete");
                }}
                className="z-50 p-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-[#ECD5B8] rounded-lg flex flex-col "
              >
                {/** Header */}
                <div className="flex justify-between  items-center text-3xl pb-4">
                  <h1 className=" font-semibold text-[#8B4513] ">
                    Image Picker
                  </h1>
                  <IoIosCloseCircleOutline
                    onClick={handleClose}
                    className="hover:cursor-pointer hover:text-[#B4540A] transition-all duration-200 "
                  />
                </div>
                {/** Content */}
                <div className="flex gap-4 w-full h-full overflow-hidden">
                  {/** Image */}
                  <div className="flex flex-col gap-2 rounded-lg min-w-[275px]">
                    <span className="text-base  text-[#8B4513]">Current:</span>
                    <img
                      src={imageUrl}
                      className="aspect-[1/1.1]  mx-auto "
                      alt="Image"
                    />
                  </div>
                  {/** Selection */}
                  <div className="flex flex-col gap-0 bg-[#FFF0DF] rounded-lg ">
                    {/** Tabs */}
                    <div className="bg-[#2C2421] rounded-t-lg flex gap-1 overflow-hidden h-20 ">
                      {tabs.map((tab) => (
                        <button
                          key={tab.value}
                          onClick={() => setActiveTab(tab.value)}
                          className={cn(
                            "text-[#8b7a6e] text-base font-bold h-full p-4 ",
                            activeTab === tab.value &&
                              "bg-[#B4540A] text-amber-300"
                          )}
                        >
                          {tab.title}
                        </button>
                      ))}
                    </div>

                    {/** Grid */}
                    <div className="grow border border-[#D4B492] overflow-y-auto rounded-b-lg ">
                      <div className="grid grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 gap-2 p-4 ">
                        {renderImages()}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.dialog>
          )}
        </AnimatePresence>,
        targetPortal
      )}
    </>
  );
};

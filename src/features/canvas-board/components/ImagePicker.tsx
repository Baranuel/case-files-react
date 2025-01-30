import { useIntersectionObserver } from "@/app/hooks/use-intersection-observer";
import { getAvailablePickerImages } from "@/utils/bucket";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Element } from "@/types";
import { DatePicker, Switch } from "antd";
import { useZero } from "@rocicorp/zero/react";
import { ZeroSchema } from "@/schema";
import dayjs from "dayjs";
import { FaClock } from "react-icons/fa";
import { FaUserShield } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";

// Types
type ImagePickerProps = {
  imageUrl?: string;
  onSelect: (imageUrl: string) => void;
  elementsList: Element[];
  element?: Element;
};

// Constants
const TABS = [
  { title: "All", value: "all" },
  { title: "Men", value: "men" },
  { title: "Women", value: "women" },
] as const;

// Animation variants
const animations = {
  modal: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  },
  modalContent: {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
  },
  grid: {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  },
  image: {
    hidden: {
      opacity: 0,
      y: 10,
      transition: { duration: 0 },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  },
};

export const ImagePicker = ({
  imageUrl,
  onSelect,
  elementsList,
  element,
}: ImagePickerProps) => {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [imageSelection, setImageSelection] = useState<string[] | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  // Hooks
  const zero = useZero<ZeroSchema>();
  const { observedElements, observe } =
    useIntersectionObserver("data-image-url");
  const targetPortal = document.getElementById("image-picker-root");

  // Memoized values
  const selectedImages = useMemo(
    () =>
      new Set(
        elementsList.filter((el) => el.imageUrl).map((el) => el.imageUrl)
      ),
    [elementsList]
  );

  const cdnUrl =
    import.meta.env.VITE_DIGITAL_OCEAN_BUCKET_CDN_URL! +
    "/" +
    import.meta.env.VITE_DIGITAL_OCEAN_BUCKET_PORTRAITS_PATH! +
    "/";

    const handleSelectImage = useCallback(
    (imageUrl: string) => {
      onSelect(imageUrl);
      setIsOpen(false);
      setActiveTab("all");
    },
    [onSelect]
  );




  const handleGetAllImages = useCallback(async () => {
    try {
      const images = await getAvailablePickerImages();
      setImageSelection(images.map((image) => cdnUrl + image));
    } catch (error) {
      console.error("Error loading images:", error);
    }
  }, [cdnUrl]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setActiveTab("all");
  }, []);

  // Filter images based on active tab
  const filteredImages = useMemo(() => {
    if (!imageSelection) return [];

    switch (activeTab) {
      case "men":
        return imageSelection.filter((image) =>
          image.toLowerCase().split("/").pop()?.startsWith("man")
        );
      case "women":
        return imageSelection.filter((image) =>
          image.toLowerCase().split("/").pop()?.startsWith("woman")
        );
      default:
        return imageSelection;
    }
  }, [imageSelection, activeTab]);

  // Render image grid
  const renderImages = useCallback(() => {
    return filteredImages.map((image) => {
      const imageAlreadySelected = selectedImages.has(image);
      const selectedClassName = imageAlreadySelected
        ? 'pointer-events-none after:content-["Selected"] after:absolute after:text-red-600 after:font-bold after:text-4xl after:top-[50%] after:left-[50%] after:-translate-x-[50%] after:-translate-y-[50%]'
        : "";

      return (
        <motion.div
          variants={animations.image}
          whileHover={{ scale: 1.05, y: 0 }}
          key={image}
          onClick={() => handleSelectImage(image)}
          className={cn(
            "relative hover:cursor-pointer hover:scale-105 w-full flex flex-col bg-[#F5E6D3] rounded-lg border border-[#D4B492] overflow-hidden shadow-md",
            selectedClassName
          )}
          ref={(el) => {
            if (el) {
              el.setAttribute("data-image-url", image);
              observe(el);
            }
          }}
        >
          {observedElements.has(image) ? (
            <motion.img
              src={image}
              alt="Selected image"
              loading="lazy"
              className={cn(
                "w-full h-full aspect-[1/1.1] object-cover hover:scale-105 shadow-md",
                imageAlreadySelected && "grayscale blur-sm"
              )}
            />
          ) : (
            <div className="w-full h-full aspect-[1/1.1] bg-gray-200 animate-pulse" />
          )}
        </motion.div>
      );
    });
  }, [
    filteredImages,
    observedElements,
    handleSelectImage,
    observe,
    selectedImages,
  ]);

  // Effects
  useEffect(() => {
    handleGetAllImages();
  }, [handleGetAllImages]);

  if (!targetPortal) {
    return <div>No image picker root</div>;
  }

  return (
    <>
      {/* Preview Section */}
      <div className="relative w-full">
        <div className="relative  p-3 w-full mb-2">
          <div className="flex gap-6">
            <img
              onClick={() => setIsOpen(!isOpen)}
              src={imageUrl}
              className="h-[170px] -rotate-1 aspect-square object-contain rounded-lg hover:cursor-pointer hover:opacity-80 hover:brightness-110 hover:bg-black/10 transition-all duration-300"
              alt="Preview"
            />
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-0.5 items-start">
                <span className="font-bold text-[#8B4513] flex items-center gap-1">
                  <FaUserCircle className="text-base" />
                  Name
                </span>
                <span className="text-[#8B4513]">{element?.content?.title || 'Unknown'}</span>
              </div>
              <div className="flex flex-col gap-0.5 items-start">
                <span className="font-bold text-[#8B4513] flex items-center gap-1">
                  <FaUserShield className="text-base" />
                  Status
                </span>
                <span className="text-[#8B4513]">
                  {element?.content?.victim ? 'Victim' : 'Suspect'}
                </span>
              </div>
              {element?.content?.victim && element?.content?.timeOfDeath && (
                <div className="flex flex-col gap-0.5 items-start">
                  <span className="font-bold text-[#8B4513] flex items-center gap-1">
                    <FaClock className="text-base" />
                    Time of Death
                  </span>
                  <span className="text-[#8B4513]">
                    {dayjs.unix(element.content.timeOfDeath).format('MMM DD - HH:mm')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {createPortal(
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.dialog
              variants={animations.modal}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
              open={isOpen}
              onClose={handleClose}
              className="z-50 absolute top-0 left-0 w-screen h-screen flex justify-center items-center bg-transparent backdrop-blur-sm"
            >
              <div
                onClick={handleClose}
                className="absolute top-0 left-0 w-full h-full bg-black/50"
              />
              <motion.div
                variants={animations.modalContent}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="z-50 p-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-[#ECD5B8] rounded-lg flex flex-col"
              >
                {/* Header */}
                <div className="flex justify-between items-center text-3xl pb-4">
                  <h1 className="font-semibold text-[#8B4513]">Image Picker</h1>
                  <IoIosCloseCircleOutline
                    onClick={handleClose}
                    className="hover:cursor-pointer hover:text-[#B4540A] transition-all duration-200"
                  />
                </div>

                {/* Content */}
                <div className="flex gap-4 w-full h-full overflow-hidden">
                  {/* Current Image */}
                  <div className="flex flex-col gap-2 rounded-lg min-w-[155px] w-1/5">
                    <span className="text-base text-[#8B4513]">Current:</span>
                    <img
                      src={imageUrl}
                      className="aspect-[1/1.1] mx-auto"
                      alt="Current"
                    />
                  </div>

                  {/* Image Selection */}
                  <div className="flex flex-col gap-0 bg-[#FFF0DF] rounded-lg min-w-[300px] h-full w-3/4 flex-1">
                    {/* Tabs */}
                    <div className="bg-[#2C2421] flex gap-1 rounded-t-lg">
                      {TABS.map((tab) => (
                        <button
                          key={tab.value}
                          onClick={() => setActiveTab(tab.value)}
                          className={cn(
                            "text-[#8b7a6e] text-base rounded-tl-lg font-bold h-full p-4",
                            activeTab === tab.value &&
                              "bg-[#B4540A] text-amber-300"
                          )}
                        >
                          {tab.title}
                        </button>
                      ))}
                    </div>

                    {/* Image Grid */}
                    <div className="grow border border-[#D4B492] overflow-y-auto rounded-b-lg">
                      <motion.div
                        key={activeTab}
                        variants={animations.grid}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 gap-2 p-4"
                      >
                        {renderImages()}
                      </motion.div>
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

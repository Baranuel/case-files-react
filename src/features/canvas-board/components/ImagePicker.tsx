import { useIntersectionObserver } from "@/app/hooks/use-intersection-observer";
import { getAvailablePickerImages } from "@/utils/bucket";
import { cn } from "@/utils/cn";
import { getImageCache } from "@/utils/image-cache";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Element } from "@/types";

type ImagePickerProps = {
  imageUrl?: string;
  onSelect: (imageUrl: string) => void;
  elementsList: Element[];
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

const modalVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const modalContentVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 }
};

const gridVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    }
  }
};

const imageVariants = {
  hidden: { 
    opacity: 0,
    y: 10,
    transition: {
      duration: 0
    }
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
};

export const ImagePicker = ({ imageUrl, onSelect, elementsList }: ImagePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageSelection, setImageSelection] = useState<string[] | null>(null);
  const targetPortal = document.getElementById("image-picker-root");
  const [activeTab, setActiveTab] = useState("all");
  const { observedElements, observe } = useIntersectionObserver('data-image-url');
  const selectedImages = useMemo(() => new Set(elementsList.filter(el => el.imageUrl).map(el => el.imageUrl)), [elementsList]);
  

  const cdnUrl =
    import.meta.env.VITE_DIGITAL_OCEAN_BUCKET_CDN_URL! +
    "/" +
    import.meta.env.VITE_DIGITAL_OCEAN_BUCKET_PORTRAITS_PATH! +
    "/";

  const handleSelectImage = (imageUrl: string) => {
    onSelect(imageUrl);
    setIsOpen(false);
    setActiveTab("all");
  };

  const handleGetAllImages = useCallback(async () => {
    try {
      const images = await getAvailablePickerImages();
      const imageWithCdn = images.map((image) => cdnUrl + image);
      setImageSelection(imageWithCdn);
    } catch (error) {
      console.error('Error loading images:', error);
    }   
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

  const filteredImages = useMemo(() => {
    if (!imageSelection) return [];
    
    switch (activeTab) {
      case "men":
        return imageSelection.filter(image => 
          image.toLowerCase().split('/').pop()?.startsWith('man')
        );
      case "women":
        return imageSelection.filter(image => 
          image.toLowerCase().split('/').pop()?.startsWith('woman')

        );
      default:
        return imageSelection;
    }
  }, [imageSelection, activeTab]);

  const renderImages = useCallback(() => {
    return filteredImages.map((image) => { 
      const imageAlreadySelected = !!selectedImages.has(image);

      return <motion.div
        variants={imageVariants}
        whileHover={{ scale: 1.05, y:0 }}
        key={image}
        onClick={() => handleSelectImage(image)}
        className={ ` ${imageAlreadySelected && ' pointer-events-none after:content-["Selected"] after:absolute after:text-red-600 after:font-bold after:text-4xl after:top-[50%] after:left-[50%] after:-translate-x-[50%] after:-translate-y-[50%]'} relative hover:cursor-pointer hover:scale-105  w-full flex flex-col bg-[#F5E6D3] rounded-lg border border-[#D4B492] overflow-hidden shadow-md` }
        ref={(el) => {
          if (el) {
            el.setAttribute('data-image-url', image);
            observe(el);
          }
        }}
      >
        {observedElements.has(image) ? (
          <motion.img
            src={image}
            alt="Image"
            loading="lazy"
            className={ `${imageAlreadySelected && 'grayscale blur-sm'} w-full h-full aspect-[1/1.1] object-cover hover:scale-105  shadow-md` }
          />
        ) : (
          <div className="w-full h-full aspect-[1/1.1] bg-gray-200 animate-pulse" />
        )}
      </motion.div>
     });
  }, [filteredImages, observedElements, handleSelectImage, observe, activeTab]);

  useEffect(() => {
    handleGetAllImages();
  }, []);

  return (
    <>
      <img
        onClick={() => setIsOpen(!isOpen)}
        src={imageUrl}
        className="h-[220px] aspect-square object-contain rounded-lg hover:cursor-pointer hover:opacity-80 hover:brightness-110 hover:bg-black/10 transition-all duration-300"
        alt="Image"
      />
      {createPortal(
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.dialog
              variants={modalVariants}
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
                variants={modalContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="z-50 p-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-[#ECD5B8] rounded-lg flex flex-col"
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
                  <div className="flex flex-col gap-2 rounded-lg min-w-[155px] w-1/5">
                    <span className="text-base  text-[#8B4513]">Current:</span>
                    <img
                      src={imageUrl}
                      className="aspect-[1/1.1]  mx-auto "
                      alt="Image"
                    />
                  </div>
                  {/** Selection */}
                  <div className="flex flex-col gap-0 bg-[#FFF0DF] rounded-lg min-w-[300px] h-full w-3/4 flex-1">
                    {/** Tabs */}
                    <div className="bg-[#2C2421] flex gap-1 rounded-t-lg">
                      {tabs.map((tab) => (
                        <button
                          key={tab.value}
                          onClick={() => {
                            setActiveTab(tab.value);
                          }}
                          className={cn(
                            "text-[#8b7a6e] text-base rounded-tl-lg font-bold h-full p-4",
                            activeTab === tab.value && "bg-[#B4540A] text-amber-300"
                          )}
                        >
                          {tab.title}
                        </button>
                      ))}
                    </div>

                    {/** Grid with filtered and searched images */}
                    <div className="grow border border-[#D4B492] overflow-y-auto rounded-b-lg">
                      <motion.div
                      key={activeTab}
                        variants={gridVariants}
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

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components";
import { AnimatePresence, motion } from "framer-motion";

export function Item({
  selected,
  updateSelected,
  className = "",
}: {
  selected: any[];
  updateSelected: (value: number) => void;
  className?: string;
}) {
  const [hide, setHide] = useState(true);
  const [image, setImage] = useState(1);

  const getRandomImage = () => {
    const newValue = Math.max(Math.floor(Math.random() * 35), 1);

    if (selected.includes(newValue)) {
      return getRandomImage();
    }

    setImage(newValue);
    updateSelected(newValue);
    setHide(!hide);
  };

  return (
    <div
      className={twMerge(
        "flex flex-col items-center space-y-[42px] flex-grow overflow-hidden]",
        className
      )}
    >
      <div className="relative aspect-[5/7] w-full h-[490px] w-[450px]">
        <div className="absolute top-0 w-full h-[40px] overflow-hidden">
          <img src="./svgs/blinds.svg" className="w-full" />
        </div>

        <div className="absolute top-0 left-0 w-full overflow-hidden max-h-[470px]">
          <AnimatePresence initial={false}>
            {hide && (
              <motion.section
                initial="collapsed"
                animate="open"
                exit="collapsed"
                variants={{
                  open: { opacity: 1, height: "auto" },
                  collapsed: { opacity: 0, height: 0, overflow: "hidden" },
                }}
                transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
              >
                <img loading="lazy" src="./svgs/blinds.svg" />
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        <div className="w-full h-full border border-[25px] border-purple-1">
          <div className="w-full h-full border border-purple-0 border-[18px]">
            {!hide && (
              <motion.div
                className="absolute top-0 left-0 z-[-1] w-full h-full"
                transition={{ duration: 0.32 }}
                animate={{ opacity: 1, zIndex: "-1" }}
                initial={{ opacity: 0, zIndex: "-1" }}
              >
                <div
                  key={"sneek-peek-image" + image}
                  className="absolute h-full z-[-1] inset-0 overflow-hidden"
                >
                  <img
                    className="h-full w-full relative top-[30px] bg-transparent"
                    src={`./images/sneak-peeks/${image}.jpg`}
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <Button
        onClick={() => getRandomImage()}
        className="px-[19px] text-[18px]"
      >
        {hide ? "Open" : "Close"}
      </Button>
    </div>
  );
}

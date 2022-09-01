import { useEffect, useState } from "react";
import { Button } from "@/components";
import { AnimatePresence, motion } from "framer-motion";

export function Item() {
  const [hide, setHide] = useState(true);
  const [image, setImage] = useState(1);

  useEffect(() => {
    if (!hide) {
      return;
    }

    const newValue = Math.max(Math.floor(Math.random() * 5), 1);

    setImage(newValue);
  }, [hide]);

  return (
    <div className="flex flex-col items-center space-y-[42px] flex-grow">
      <div className="relative aspect-[5/7] w-full min-w-[350px] max-w-[700px]">
        <div className="absolute top-0 w-full h-[40px] overflow-hidden">
          <img src="./assets/svgs/blinds.svg" className="w-full" />
        </div>

        <div className="absolute top-0 left-0 w-full">
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
                <img
                  src="./assets/svgs/blinds.svg"
                  className="w-screen aspect-[500/641]"
                />
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
                <img
                  className="absolute w-full z-[-1] top-0 left-0"
                  src={`./assets/sneak-peeks/sneak-peek-${image}.webp`}
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <Button onClick={() => setHide(!hide)} className="px-[19px]">
        {hide ? "Open" : "Close"}
      </Button>
    </div>
  );
}

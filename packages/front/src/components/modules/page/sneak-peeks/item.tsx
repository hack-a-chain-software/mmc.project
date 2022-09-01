import { useState } from "react";
import { Button } from "@/components";
import { AnimatePresence, motion } from "framer-motion";

export function Item() {
  const [hide, setHide] = useState(true);

  return (
    <div className="flex flex-col items-center space-y-[42px]">
      <div className="relative">
        <div className="absolute top-0 h-[40px] overflow-hidden">
          <img src="./assets/svgs/blinds.svg" />
        </div>

        <div className="absolute top-0 left-0 h-full">
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
                <img src="./assets/svgs/blinds.svg" />
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        <div className="w-screen max-w-[500px] h-[700px] border border-[25px] border-purple-1">
          <div className="w-full h-full border border-purple-0 border-[18px]"></div>
        </div>
      </div>

      <Button onClick={() => setHide(!hide)} className="px-[19px]">
        Open
      </Button>
    </div>
  );
}

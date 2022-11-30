import { motion } from "framer-motion";
import { PropsWithChildren } from "react";

export const FadeInTransition = ({ children }: PropsWithChildren) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      // viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      variants={{
        visible: { opacity: 1 },
        hidden: { opacity: 0 },
      }}
      children={children}
    />
  );
};

export default FadeInTransition;

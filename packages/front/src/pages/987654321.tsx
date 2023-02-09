import { Suspense } from 'react';
import { Scene, Fallback } from '@/components';
import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from '@/stores/game';

const duration = 1.8;

export const Play = () => {
  const { controls } = useGame();

	return (
		<>
			<Fallback />

      {controls && (
        <AnimatePresence>
          <motion.div
            key="play-motion-hero"
            animate={controls}
            initial={{ clipPath: 'circle(0% at 50vw 50vh)' }}
            exit={{ clipPath: 'circle(0% at 50vw 50vh)' }}
            transition={{ duration }}
            className="min-h-screen relative"
          >
            <Suspense fallback={null}>
              <Scene />
            </Suspense>
          </motion.div>
        </AnimatePresence>
      )}
		</>
	);
};

export default Play;

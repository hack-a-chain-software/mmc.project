import { Suspense } from 'react';
import { useEffect } from 'react';
import { useUser } from '@/stores/user';
import { useGame } from '@/stores/game';
import { useWallet } from '@/stores/wallet';
import { Scene, Fallback } from '@/components';
import { useAnimationControls } from 'framer-motion';
import { AnimatePresence, motion } from 'framer-motion';

const duration = 1.8;

export const Game = () => {
  const controls = useAnimationControls();

  const {
    initGame,
  } = useGame();

  const {
    accountId,
    initWallet,
  } = useWallet();

  const {
    validateUser,
  } = useUser();

  useEffect(() => {
    void (async () => {

      await initWallet();
    })();
  }, [initWallet]);

  useEffect(() => {
    if (accountId === null) {
      return;
    }

    void (async () => {
      await validateUser();
      await initGame(controls);
    })();
  }, [accountId]);

	return (
		<>
      {controls && (
        <AnimatePresence>
          <motion.div
            key="play-motion-hero"
            animate={controls}
            initial={{ clipPath: 'circle(200% at 50vw 50vh)' }}
            exit={{ clipPath: 'circle(200% at 50vw 50vh)' }}
            transition={{ duration }}
            className="min-h-screen fixed inset-0 z-[99] overflow-hidden"
          >
            <Fallback />
          </motion.div>
        </AnimatePresence>
      )}

      <Suspense fallback={null}>
        <Scene />
      </Suspense>
		</>
	);
};

export default Game;

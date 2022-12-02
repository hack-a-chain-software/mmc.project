import scenes from '@/scenes.json';
import { Scene, WalletDropdown, Fallback, Socials } from '@/components';
import { AnimatePresence, motion } from 'framer-motion';
import { useWalletSelector } from '@/utils/context/wallet';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { SceneInterface } from '@/utils/interfaces';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router';
import { loadSceneImage } from '@/utils/helpers';

import { useAnimationControls } from 'framer-motion';

const duration = 1.8;

export const Play = (props) => {
  const navigate = useNavigate();
  const { accountId } = useWalletSelector();
  const [loading, setLoading] = useState(true);
  const [scene, setScene] = useState<SceneInterface | null>(null);

  const controls = useAnimationControls();

  useEffect(() => {
    setTimeout(() => {
      setScene(scenes[0]);
    }, 4000);
  }, []);

  const fetchScene = useCallback(() => {
    setLoading(true);

    setTimeout(() => {
      setScene(scenes[1] ?? null);
    }, 4000);
  }, [loading, scene]);

  return (
    <>
      <Fallback />

			<AnimatePresence>
				<motion.div
					key="play-motion-hero"
          animate={controls}
					initial={{ clipPath: 'circle(0% at 50vw 50vh)' }}
					exit={{ clipPath: 'circle(0% at 50vw 50vh)' }}
					transition={{ duration }}
					className="
            w-screen min-h-screen relative
          "
				>
          <Suspense fallback={null}>
  					<div className="absolute px-[30px] w-full max-w-[1340px] pt-[32px] z-[9] flex items-center justify-end space-x-[32px] left-1/2 -translate-x-1/2">
  						<button
  							onClick={() => navigate('/')}
  							className="mr-auto flex space-x-[8px] items-center"
  						>
  							<ArrowLeftIcon className="text-white w-[18px]" />

  							<span className="text-white">Back</span>
  						</button>

  						<Socials />

  						<WalletDropdown />
  					</div>

						<Scene
              {...scenes[0]}
              controls={controls}
              setLoading={data => setLoading(true)}
            />
        </Suspense>
			 </motion.div>
			</AnimatePresence>
    </>
  );
};

export default Play;

import { Button, Scene, WalletDropdown, Fallback, Socials, GuessModal } from '@/components';
import { AnimatePresence, motion } from 'framer-motion';
import { Suspense, useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router';

import { useAnimationControls } from 'framer-motion';

const duration = 1.8;

export const Play = () => {
	const navigate = useNavigate();
	const controls = useAnimationControls();
  const [showGuessModal, setShowGuessModal] = useState(false);

	return (
		<>
			<Fallback />

      <GuessModal
        isOpen={showGuessModal}
        onClose={() => setShowGuessModal(false)}
      />

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

              <Button
                onClick={() => setShowGuessModal(true)}
              >
                <span>
                  Guessing now open
                </span>
              </Button>

              <Socials />

							<WalletDropdown />
						</div>

						<Scene controls={controls} />
					</Suspense>
				</motion.div>
			</AnimatePresence>
		</>
	);
};

export default Play;

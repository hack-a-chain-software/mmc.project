import { Scene, WalletDropdown, Fallback, Socials } from '@/components';
import { AnimatePresence, motion } from 'framer-motion';
import { useWalletSelector } from '@/utils/context/wallet';
import { useState, useCallback, Suspense } from 'react';
import { SceneInterface } from '@/utils/interfaces';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router';

import { useAnimationControls } from 'framer-motion';

const duration = 1.8;

export const Play = (props) => {
	const navigate = useNavigate();
	const { accountId } = useWalletSelector();
	const [loading, setLoading] = useState(true);
	const [scene, setScene] = useState<SceneInterface | null>(null);
	const controls = useAnimationControls();

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
							controls={controls}
							setLoading={() => {
								setLoading(true);
							}}
						/>
					</Suspense>
				</motion.div>
			</AnimatePresence>
		</>
	);
};

export default Play;

import { Suspense } from 'react';
import { Scene, Fallback } from '@/components';
import { AnimatePresence, motion } from 'framer-motion';
import { useAnimationControls } from 'framer-motion';

const duration = 1.8;

export const Play = () => {
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
					className="min-h-screen relative"
				>
					<Suspense fallback={null}>
						<div className="absolute px-[30px] w-full max-w-[1340px] pt-[32px] z-[9] flex items-center justify-end space-x-[32px] left-1/2 -translate-x-1/2">
						</div>

						<Scene controls={controls} />
					</Suspense>
				</motion.div>
			</AnimatePresence>
		</>
	);
};

export default Play;

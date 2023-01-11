import scenes from '@/scenes.json';
import { Scene, WalletDropdown, Fallback, Socials } from '@/components';
import { AnimatePresence, motion } from 'framer-motion';
import { useWalletSelector } from '@/utils/context/wallet';
import { useState, useEffect, useCallback } from 'react';
import { SceneInterface } from '@/utils/interfaces';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router';

const duration = 1.8;

const loadSceneImage = (url, callback) => {
	const image = new Image();
	image.src = url;
	image.onload = callback;
};

export const Play = () => {
	const navigate = useNavigate();

	const { accountId } = useWalletSelector();
	const [loading, setLoading] = useState(true);
	const [scene, setScene] = useState<SceneInterface | null>(null);

	useEffect(() => {
		setTimeout(() => {
			setScene(scenes[0]);
			loadSceneImage(scenes[0].image, () => setLoading(false));
		}, 4000);
	}, []);

	const fetchScene = useCallback(() => {
		setLoading(true);

		setTimeout(() => {
			setScene(scenes[1] ?? null);
			loadSceneImage(scenes[1].image, () => setLoading(false));
		}, 4000);
	}, [loading, scene]);

	return (
		<>
			{loading && <Fallback />}

			<AnimatePresence>
				{!loading && (
					<motion.div
						key="play-motion-hero"
						initial={{ clipPath: 'circle(0% at 50vw 50vh)' }}
						animate={{ clipPath: 'circle(100% at 50vw 50vh)' }}
						exit={{ clipPath: 'circle(0% at 50vw 50vh)' }}
						transition={{ duration }}
						className="w-screen min-h-screen relative"
					>
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

						<Scene {...scenes[0]} fetchScene={() => fetchScene()} />
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};

export default Play;

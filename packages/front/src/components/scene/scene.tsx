import { Clue } from './clue';
import { Portal } from './portal';
import { useEffect } from 'react';
import { SuspenseImage } from '@/components';
import { useGame } from '@/stores/game';

export const Scene = () => {
  const { controls, config, scene, getScene, jwt } = useGame();

  useEffect(() => {
    if (!jwt && !config) {
      return;
    }

    void getScene();
  }, [jwt, config]);

	useEffect(() => {
    if (!scene || !controls) {
      return;
    }

    controls.start({ clipPath: 'circle(100% at 50vw 50vh)' });
	});

	const moveToScene = async (id) => {
    if (!controls) {
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

		await controls.start({ clipPath: 'circle(0% at 50vw 50vh)' });

		void getScene(id);
	};

	return (
		<div className="relative bg-blue-100 min-h-screen">
			{scene &&
				scene.images.map(({ z_index, media }) => (
					<SuspenseImage
						src={media}
            className="relative"
						style={{ zIndex: z_index }}
						key={`scene-${scene?.id as string}-asset-${z_index as number}`}
					/>
				))}

			{scene &&
				scene.clues.map((clue, i) => (
					<Clue
						{...clue}
						sceneName={scene.name}
						key={`scene-${scene?.id as string}-point-${i as number}`}
					/>
				))}

			{scene &&
				scene?.warps.map(({ position_top, position_left, warps_to }, index) => (
					<Portal
						position={{ left: `${position_left as string}%`, top: `${position_top as string}%` }}
						onClick={() => void moveToScene(warps_to)}
						key={`mmc-scene-portal-${index as number}`}
					/>
				))}
		</div>
	);
};

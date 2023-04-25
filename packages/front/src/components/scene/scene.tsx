import { Clue } from './clue';
import { Portal } from './portal';
import { useEffect, useState } from 'react';
import { SuspenseImage } from '@/components';
import { useGame } from '@/stores/game';
import { firstScene } from '@/constants/env';

export const Scene = () => {
  const [showVideo, setShowVideo] = useState(false);

  const {
    scene,
    controls,
    isLoading,
    moveToScene,
    openScene,
  } = useGame();

	useEffect(() => {
    if (!!!scene || !!!controls) {
      return;
    }

    setTimeout(async () => {
      await openScene();

      if (scene.id === firstScene) {
        setShowVideo(true);
      }
    }, 120);
	});

	return (
		<div className="relative bg-blue-100 min-h-screen">
      <div
        className="absolute -top-[80px] z-[9999999999] scale-[0.6] opacity-1 pointer-events-none"
      >
        {
          showVideo && scene &&
          <video preload="metadata" autoPlay muted playsInline>
            <source src="/logo.webm" type="video/webm"/>
          </video>
        }
      </div>

			{scene &&
				scene.images.map(({ z_index, media }) => (
					<SuspenseImage
						src={media}
            className="relative pointer-events-none"
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
						onClick={() => {
              if (!isLoading) {
                return;
              }

              setShowVideo(false);
              void moveToScene(warps_to as string);
            }}
						key={`mmc-scene-portal-${index as number}`}
					/>
				))}
		</div>
	);
};

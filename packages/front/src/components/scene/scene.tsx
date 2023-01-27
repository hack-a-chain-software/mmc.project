import { Clue } from './clue';
import { Portal } from './portal';
import { useState, useEffect } from 'react';
import { SuspenseImage } from '@/components';
import api from '@/services/api';
import { useWalletSelector } from '@/context/wallet';

export const Scene = ({ controls }: { controls: any }) => {
  const { jwt } = useWalletSelector();

	const [scene, setScene] = useState<any>();

  const loadScene = async (id = '473af5a1-6b3b-4d18-af28-2fc42e657ba2') => {
    const { data } = await api.get(`/game/scene/${id}`, {
      headers: { Authorization: `Bearer ${jwt as string}` },
    });

    setScene(data);
  };

  useEffect(() => {
    if (!jwt) {
      return;
    }

    void loadScene();
  }, [jwt]);

	useEffect(() => {
    if (!scene) {
      return;
    }

    controls.start({ clipPath: 'circle(100% at 50vw 50vh)' });
	});

	const moveToScene = async (id) => {
		await controls.start({ clipPath: 'circle(0% at 50vw 50vh)' });

		void loadScene(id);
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
						onClick={() => moveToScene(warps_to)}
						key={`mmc-scene-portal-${index as number}`}
					/>
				))}
		</div>
	);
};

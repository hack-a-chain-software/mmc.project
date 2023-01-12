import { Clue } from './clue';
import { Portal } from './portal';
import { useState, useEffect } from 'react';
import scenes from '@/utils/json/scenes.json';
import { SuspenseImage } from '@/components';
import { SceneInterface } from '@/utils/interfaces';
import { graphql, useLazyLoadQuery } from 'react-relay';

export const Scene = ({ controls }: SceneInterface & { controls: any }) => {
	const [repo, setRepo] = useState({
		owner: '1mateus',
		name: 'single',
	});

	const [scene, setScene] = useState(scenes[0]);

	const data = useLazyLoadQuery(
		graphql`
			query sceneQuery($owner: String!, $name: String!) {
				repository(owner: $owner, name: $name) {
					name
					id
				}
			}
		`,
		{ ...repo }
	);

	useEffect(() => {
		controls.start({ clipPath: 'circle(100% at 50vw 50vh)' });
	});

	const moveToScene = async (id) => {
		await controls.start({ clipPath: 'circle(0% at 50vw 50vh)' });

		setRepo({
			owner: '1mateus',
			name: 'dotfiles',
		});

		setScene(scenes[id]);
	};

	return (
		<div className="relative bg-blue-100 overflow-hidden min-h-screen">
			{scene &&
				scene.images.map(({ order, image }) => (
					<SuspenseImage
						src={image}
						style={{ zIndex: order }}
						className="absolute bottom-0"
						key={`scene-${scene?.name as string}-asset-${order as number}`}
					/>
				))}

			{scene &&
				scene.clues.map((clue, i) => (
					<Clue
						{...clue}
						sceneName={scene.name}
						key={`scene-${scene?.name as string}-point-${i as number}`}
					/>
				))}

			{scene &&
				scene?.warps.map(({ position, sendTo }, index) => (
					<Portal
						position={position}
						onClick={() => moveToScene(sendTo)}
						key={`mmc-scene-portal-${index as number}`}
					/>
				))}
		</div>
	);
};

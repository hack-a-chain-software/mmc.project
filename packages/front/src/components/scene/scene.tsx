import { Clue } from './clue';
import { Portal } from './portal';
import scenes from '@/scenes.json';
import isArray from 'lodash/isArray';
import { SuspenseImage } from '@/components';
import { SceneInterface } from '@/utils/interfaces';
import { useState, useEffect, useMemo } from 'react';
import { graphql, useLazyLoadQuery } from 'react-relay';

export const Scene = ({
	name,
	clues,
	setLoading,
	controls,
}: SceneInterface & { setLoading: (a: any) => any; controls: any }) => {
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
		{
			...repo,
		}
	);

	useEffect(() => {
		controls.start({ clipPath: 'circle(100% at 50vw 50vh)' });
	});

	const handePortal = async () => {
		await controls.start({ clipPath: 'circle(0% at 50vw 50vh)' });

		setRepo({
			owner: '1mateus',
			name: 'dotfiles',
		});
	};

	const assets = useMemo(() => {
		if (!scene) {
			return [];
		}

		const { image } = scene;

		return [...(isArray(scene.image) ? image : [image])];
	}, [scene]);

	return (
		<div className="relative">
			{assets &&
				assets.map((asset, id) => (
					<SuspenseImage
						src={asset}
						key={`scene-${scene?.id as string}-asset-${id}`}
					/>
				))}

			{scene &&
				scene.clues.map((clue, i) => (
					<Clue
						{...clue}
						sceneName={name}
						key={`scene-${name as string}-point-${i as number}`}
					/>
				))}

			{scene &&
				scene.warps.map((portal, index) => (
					<Portal
						onClick={() => handePortal()}
						position={{
							top: '61.3%',
							left: '37%',
						}}
					/>
				))}
		</div>
	);
};

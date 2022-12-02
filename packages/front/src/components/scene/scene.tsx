import { Clue } from './clue';
import { useState, useEffect } from 'react';
import { Portal } from './portal';
import { SceneInterface } from '@/utils/interfaces';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { SuspenseImage } from '@/components';

export const Scene = ({ name, clues, setLoading, controls }: SceneInterface & { setLoading: (a: any) => any, controls: any}) => {
  const [repo, setRepo] = useState({
    owner: '1mateus',
    name: 'single',
  });

  const [image, setImage] = useState('./images/scenes/1.png');

  const data = useLazyLoadQuery(
    graphql`
      query sceneQuery($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
          name,
          id,
        }
      }
    `,
    {
      ...repo,
    },
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

    setImage('https://images7.alphacoders.com/403/403331.png');
  };

  console.log(JSON.stringify(data));

  return (
    <div className="relative">
      <SuspenseImage src={image} />

      {clues &&
        clues.map((clue, i) => (
          <Clue
            {...clue}
            sceneName={name}
            key={`scene-${name as string}-point-${i as number}`}
          />
        ))}

        <Portal
          onClick={() => handePortal()}
          position={{
            top: '61.3%',
            left: '37%',
          }}
        />
    </div>
  );
};

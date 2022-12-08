import { Clue } from './clue';
import { Portal } from './portal';
import { SceneInterface } from '@/utils/interfaces';
import { useMemo } from 'react';

const positions = [
  {
    top: '60.3%',
    left: '11%',
  },
  {
    top: '67.0%',
    left: '31%',
  },
];

export const Scene = ({ image, name, clues, fetchScene, portal }: SceneInterface & { fetchScene: (id: number) => any }) => {

  const portalPos = useMemo(() => {
    return
  }, [portal])
  return (
    <div className="relative bg-blue-100">
      <img src={image} />

      {clues &&
        clues.map((clue, i) => (
          <Clue
            {...clue}
            sceneName={name}
            key={`scene-${name}-point-${i}`}
          />
        ))}

        <Portal
          onClick={() => fetchScene(portal)}
          position={positions[portal || 0]}
        />
    </div>
  );
};

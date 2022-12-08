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
    top: '48%',
    left: '15%',
  },
];

export const Scene = ({ image, name, clues, fetchScene, bg, portal }: SceneInterface & { fetchScene: (id: number) => any }) => {
  return (
    <div className="relative bg-blue-100 overflow-hidden min-h-screen flex items-end">
      {bg && (
        <img
          src={bg}
          className="absolute top-0"
        />
      )}

      <div
        className="relative z-[99999999999]"
      >
        <img
          src={image}
          className="relative z-[2] w-screen"
        />

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
    </div>
  );
};

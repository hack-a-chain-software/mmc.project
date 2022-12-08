import { Clue } from './clue';
import { Portal } from './portal';
import { SceneInterface } from '@/utils/interfaces';

export const Scene = ({ image, name, clues, fetchScene, portal }: SceneInterface & { fetchScene: (id: number) => any }) => {
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
          position={{
            top: '61.3%',
            left: '37%',
          }}
        />
    </div>
  );
};

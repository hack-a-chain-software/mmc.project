import { Clue } from './clue';
import { Portal } from './portal';
import { SceneInterface } from '@/utils/interfaces';

export const Scene = ({ image, name, clues, fetchScene }: SceneInterface & { fetchScene: () => any }) => {
  return (
    <div className="relative">
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
          onClick={() => fetchScene()}
          position={{
            top: '61.3%',
            left: '37%',
          }}
        />
    </div>
  );
};

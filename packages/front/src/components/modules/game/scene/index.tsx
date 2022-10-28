import { Clue } from "./clue";
import { SceneInterface } from "@/utils/interfaces";

export const Scene = ({ image, name, clues }: SceneInterface) => {
  return (
    <div className="relative">
      <img src={image} />

      {clues &&
        clues.map((clue, i) => (
          <Clue {...clue} key={`scene-${name}-point-${i}`} />
        ))}
    </div>
  );
};

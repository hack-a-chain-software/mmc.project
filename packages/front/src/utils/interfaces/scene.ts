export interface SceneInterface {
  image: string;
  name: string;
  portal: number;
  clues: ClueInterface[];
}

export interface ClueInterface {
  name?: string;
  about?: string;
  owner?: string | null;
  position: position;
}

interface position {
  top?: string;
  left?: string;
  rigth?: string;
  bottom?: string;
}

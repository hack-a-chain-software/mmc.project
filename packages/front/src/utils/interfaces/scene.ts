export interface SceneInterface {
  image: string;
  name: string;
  clues: ClueInterface[];
}

export interface ClueInterface {
  type: string;
  name?: string;
  about?: string;
  action?: string;
  position: position;
}

interface position {
  top?: string;
  left?: string;
  rigth?: string;
  bottom?: string;
}

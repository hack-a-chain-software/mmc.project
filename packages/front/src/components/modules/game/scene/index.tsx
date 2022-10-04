interface point {
  name?: string;
  about?: string;
  action?: string | number;
  type: "clue" | "portal";
}

export const Scene = ({
  image,
  name,
  points,
}: {
  image: string;
  name: string;
  points: point[];
}) => {
  return <div></div>;
};

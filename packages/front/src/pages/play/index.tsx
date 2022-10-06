import { Scene } from "@/components";
import scenes from "@/scenes.json";

export const Play = () => {
  return (
    <main className="w-screen min-h-screen">
      <Scene {...scenes[0]} />
    </main>
  );
};

export default Play;

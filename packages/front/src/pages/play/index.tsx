import { Scene } from "@/components";
import scenes from "@/scenes.json";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useNearWalletSelector } from "@/utils/context/wallet";

export const Play = () => {
  const navigate = useNavigate();

  const { accountId } = useNearWalletSelector();

  useEffect(() => {
    if (!accountId) {
      navigate("/connect");
    }
  }, [accountId]);

  return (
    <main className="w-screen min-h-screen">
      <Scene {...scenes[0]} />
    </main>
  );
};

export default Play;

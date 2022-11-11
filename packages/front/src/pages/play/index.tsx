import { Scene } from "@/components";
import scenes from "@/scenes.json";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useWalletSelector } from "@/utils/context/wallet";
import { prefix } from "@/utils/helpers";

export const Play = () => {
  const navigate = useNavigate();

  const { accountId } = useWalletSelector();

  useEffect(() => {
    if (!accountId) {
      navigate(prefix + "/connect");
    }
  }, [accountId]);

  return (
    <main className="w-screen min-h-screen">
      <Scene {...scenes[0]} />
    </main>
  );
};

export default Play;

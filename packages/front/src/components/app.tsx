import routes from '~react-pages';
import { Header } from './header';
import { Footer } from './footer';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useWalletSelector } from '@/context/wallet';
import { Toaster } from 'react-hot-toast';
import api from '@/services/api';

export interface GameConfig {
  guess_questions: any[];
  guess_available_at: string;
  season_ends_at: string;
  created_at: string;
}

const Pages = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return useRoutes(routes);
};

export const App = () => {
  const { accountId, keyPair, login, jwt } = useWalletSelector();
  const [gameConfig, setGameConfig] = useState<GameConfig>();

  useEffect(() => {
    void (async () => {
      await login(keyPair, accountId);

      if (!jwt) {
        return;
      }


      const { data } = await api.get('/game/config', {
        headers: { Authorization: `Bearer ${jwt as string}` },
      });

      setGameConfig(data as GameConfig);
    })();
  }, [accountId, keyPair, jwt]);

  return (
    <Router>
      <Header
        config={gameConfig as GameConfig}
      />

      <Pages />

      <div
        className="relative z-[999999999999999999999]"
      >
        <Toaster />
      </div>

      <Footer />
    </Router>
  );
};

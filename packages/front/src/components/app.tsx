import routes from '~react-pages';
import { Header } from './header';
import { Footer } from './footer';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { useEffect } from 'react';
import { useWalletSelector } from '@/context/wallet';
import { Toaster } from 'react-hot-toast';
import { useGame } from '@/stores/game';
import { useAnimationControls } from 'framer-motion';

const Pages = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return useRoutes(routes);
};

export const App = () => {
  const controls = useAnimationControls();

  const { login, accountId: gameAccountid, isLoading } = useGame();

  const { accountId, getLoginPayload } = useWalletSelector();

  useEffect(() => {
    if (
      typeof accountId !== 'string'
      || accountId === gameAccountid
      || isLoading
    ) {
      console.log('reutrn');

      return;
    }

    void (async () => {
      const loginPayload = getLoginPayload();

      await login(loginPayload, accountId || '', controls);
    })();
  }, [accountId]);

  return (
    <Router>
      <Header/>

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

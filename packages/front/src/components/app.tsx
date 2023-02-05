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

  const { login, accountId: gameAccountid } = useGame();

  const {
    accountId,
    getLoginPayload,
    isLoading: isLoadingWallet,
  } = useWalletSelector();

  useEffect(() => {
    if (accountId === undefined || isLoadingWallet) {
      return;
    }

    console.log('-----');
    console.log('(1) accountid', accountId);
    console.log('(2) typeof', typeof accountId === undefined);
    console.log('(3) game accountid', gameAccountid);
    console.log('(4) isLoadingWallet', isLoadingWallet);
    console.log('-----');

    void (async () => {
      console.log('oha', accountId);

      const loginPayload = getLoginPayload();

      await login(loginPayload, accountId || '', controls);
    })();
  }, [accountId, gameAccountid, isLoadingWallet]);

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

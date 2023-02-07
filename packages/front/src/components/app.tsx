import routes from '~react-pages';
import { Header } from './header';
import { Footer } from './footer';
import { useEffect } from 'react';
import { useGame } from '@/stores/game';
import { Toaster } from 'react-hot-toast';
import { useWallet } from '@/stores/wallet';
import { useAnimationControls } from 'framer-motion';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { useUser } from '@/stores/user';

const Pages = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return useRoutes(routes);
};

export const App = () => {
  const controls = useAnimationControls();

  const { initGame } = useGame();

  const {
    accountId,
    initWallet,
  } = useWallet();

  const {
    validateUser,
  } = useUser();

  useEffect(() => {
    void (async () => {

      await initWallet();
    })();
  }, [initWallet]);

  useEffect(() => {
    if (accountId === null) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.log(`components/app.tsx: (2) login trigged for account id ${accountId as string}`);

    void (async () => {
      await validateUser();
      await initGame(controls);
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

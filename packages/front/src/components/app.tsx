import routes from '~react-pages';
import { Header } from './header';
import { Footer } from './footer';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { useEffect } from 'react';
import { useWalletSelector } from '@/context/wallet';
import { Toaster } from 'react-hot-toast';
import { useGame } from '@/stores/game';
// import { useIsGame } from '@/hooks';
import { useAnimationControls } from 'framer-motion';

const Pages = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return useRoutes(routes);
};

export const App = () => {
  const controls = useAnimationControls();

  const { login } = useGame();

  // const inGame = useIsGame();

  const {
    accountId,
    getLoginPayload,
  } = useWalletSelector();

  useEffect(() => {
    console.log('');
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.log(`components/app.tsx: (1) useffect trigged for account id ${accountId as string}`);

    if (typeof accountId === 'undefined') {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.log(`components/app.tsx: (2) login trigged for account id ${accountId as string}`);

    void (async () => {
      const loginPayload = await getLoginPayload();

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

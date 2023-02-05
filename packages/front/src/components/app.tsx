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

  const { login } = useGame();

  const {
    isLoading,
    accountId,
    getLoginPayload,
  } = useWalletSelector();

  useEffect(() => {
    console.log('-- app.tsx --');
    console.log('walelt selector account id: ', accountId);
    console.log('walelt selector is loading: ', isLoading);
    console.log('-- app.tsx --');

    if (
      isLoading && typeof accountId === 'undefined') {
      return;
    }

    console.log('-- app.tsx --');
    console.log('walelt selector account id: ', accountId);
    console.log('walelt selector is loading: ', isLoading);
    console.log('-- app.tsx --');

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

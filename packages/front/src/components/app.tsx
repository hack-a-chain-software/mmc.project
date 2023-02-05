import routes from '~react-pages';
import { Header } from './header';
import { Footer } from './footer';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { useWalletSelector } from '@/context/wallet';
import { Toaster } from 'react-hot-toast';
import { useGame } from '@/stores/game';
import { useAnimationControls } from 'framer-motion';
import { gameRoute } from '@/constants';

const Pages = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return useRoutes(routes);
};

export const App = () => {
  const controls = useAnimationControls();

  const { login } = useGame();

	const inGame = useMemo(() => {
		return window.location.pathname === gameRoute;
	}, [window.location.pathname]);

  const {
    isLoading,
    accountId,
    getLoginPayload,
  } = useWalletSelector();

  useEffect(() => {
    console.log('');
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.log(`app.tsx: useffect trigged for account id ${accountId as string} and isLoading: ${isLoading}`);

    if (
      inGame && isLoading && typeof accountId === 'undefined') {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.log(`app.tsx: login trigged for account id ${accountId as string} and isLoading: ${isLoading}`);

    void (async () => {
      const loginPayload = getLoginPayload();

      await login(loginPayload, accountId || '', controls);
    })();
  }, [accountId, isLoading]);

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

import routes from '~react-pages';
import { Header } from './header';
import { Footer } from './footer';
import { useEffect } from 'react';
import { useUser } from '@/stores/user';
import { useGame } from '@/stores/game';
import { Toaster } from 'react-hot-toast';
import { useWallet } from '@/stores/wallet';
import { useAnimationControls } from 'framer-motion';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { ModalProvider } from '@/modals';
import toast from 'react-hot-toast';
import { Toast } from '@/components';
import { getTransactionState, getTransactionsAction } from '@/helpers/transactions';
import { useModal } from '@/stores/modal';

const transactionHashes = new URLSearchParams(window.location.search).get(
  'transactionHashes',
);

const Pages = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return useRoutes(routes);
};

export const App = () => {
  const controls = useAnimationControls();

  const { scene, initGame } = useGame();

  const {
    accountId,
    initWallet,
  } = useWallet();

  const {
    validateUser,
  } = useUser();

  const {
    onShowModal,
  } = useModal();

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

  useEffect(() => {
    if (!accountId || !transactionHashes || !scene) {
      return;
    }

    void (async () => {
      const transactions = transactionHashes.split(",");

      const states: any[] = [];

      for (let i = 0; i < transactions.length; i++) {
        const state = await getTransactionState(transactions[i], accountId);

        states.push(state);
      }

      const action = getTransactionsAction(states);

      if (!action) {
        return;
      }

      window.history.pushState({}, document.title, '/987654321' );

      if (action.status === 'success') {
        toast.success(action.message as string);
      }

      if (action.message === 'Successfully staked NFTs.') {
        setTimeout(() => {
          onShowModal('gameClues');
        }, 800);

        return;
      }
    })();
  }, [scene]);

  return (
    <Router>
      <Header/>

      <Pages />

      <ModalProvider/>

      <div
        className="relative z-[999999999999999999999]"
      >
        <Toaster />
      </div>

      <Footer />
    </Router>
  );
};

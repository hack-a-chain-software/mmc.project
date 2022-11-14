import './index.css';
import React, { Suspense } from 'react';
import { App, Loader, WalletSelectorModal } from '@/components';
import ReactDOM from 'react-dom/client';
import { WalletSelectorContextProvider } from '@/utils/context/wallet';

import { RelayEnvironmentProvider } from 'react-relay';
import { RelayEnvironment } from './relay';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WalletSelectorContextProvider>
      <RelayEnvironmentProvider environment={RelayEnvironment}>
        <Suspense fallback={<Loader />}>
          <App />
        </Suspense>
      </RelayEnvironmentProvider>

      <WalletSelectorModal />
    </WalletSelectorContextProvider>
  </React.StrictMode>,
);

import './index.css';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { App, WalletSelectorModal } from '@/components';
import { WalletSelectorContextProvider } from '@/utils/context/wallet';
import { RelayEnvironment } from './relay';
import { RelayEnvironmentProvider } from 'react-relay';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WalletSelectorContextProvider>
      <RelayEnvironmentProvider environment={RelayEnvironment}>
        <App />
      </RelayEnvironmentProvider>

      <WalletSelectorModal />
    </WalletSelectorContextProvider>
  </React.StrictMode>,
);

import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from '@/components';
import { WalletModal } from './modals';
import { WalletSelectorContextProvider } from '@/context/wallet';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WalletSelectorContextProvider>
      <App />

      <WalletModal />
    </WalletSelectorContextProvider>
  </React.StrictMode>,
);

import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App, WalletSelectorModal } from '@/components';
import { WalletSelectorContextProvider } from '@/context/wallet';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WalletSelectorContextProvider>
      <App />

      <WalletSelectorModal />
    </WalletSelectorContextProvider>
  </React.StrictMode>,
);

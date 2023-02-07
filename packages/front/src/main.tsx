import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from '@/components';
import { WalletModal } from './modals';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <App />

      <WalletModal />
  </React.StrictMode>,
);

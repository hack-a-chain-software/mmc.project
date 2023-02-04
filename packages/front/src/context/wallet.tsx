import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
} from 'react';
import { keyStores } from 'near-api-js';
import type { AccountView } from 'near-api-js/lib/providers/provider';
import { map, distinctUntilChanged } from 'rxjs';
import { setupWalletSelector } from '@near-wallet-selector/core';
import type { WalletSelector, AccountState } from '@near-wallet-selector/core';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupNearWallet } from '@near-wallet-selector/near-wallet';
import { gameSeason, network } from '@/constants/env';
import { KeyPair } from 'near-api-js';
import { LoginData } from '@/stores/game';

interface WalletContextValue {
  showModal: boolean;
  accountId: string | null;
  toggleModal: () => void;
  selector: WalletSelector;
  signOut: () => Promise<void>;
  getLoginPayload: () => LoginData;
}

export type Account = AccountView & {
  account_id: string;
};

const WalletContext =
  React.createContext<WalletContextValue | null>(null);

export const WalletSelectorContextProvider: React.FC<
  PropsWithChildren<Record<any, any>>
> = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [keyPair, setKeypair] = useState<KeyPair>();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<AccountState[]>([]);
  const [selector, setSelector] = useState<WalletSelector | null>(null);

  const toggleModal = () => setShowModal(!showModal);

  const signOut = async () => {
    if (!selector) {
      return;
    }

    const wallet = await selector.wallet();

    await wallet.signOut();
  };

  const init = useCallback(async () => {
    const newSelector = await setupWalletSelector({
      network: network,
      debug: true,
      modules: [setupMyNearWallet(), setupNearWallet()],
    });

    const state = newSelector.store.getState();

    setAccounts(state.accounts);
    setSelector(newSelector);
  }, []);

  useEffect(() => {
    init().catch((err) => {
      console.error(err);
      alert('Failed to initialize wallet selector');
    });
  }, [init]);

  useEffect(() => {
    if (!selector) {
      return;
    }

    const subscription = selector.store.observable
      .pipe(
        map(({ accounts: storeAccounts }) => storeAccounts),
        distinctUntilChanged(),
      )
      .subscribe((nextAccounts) => {
        setAccounts(nextAccounts);
        setShowModal(false);
      });

    return () => subscription.unsubscribe();
  }, [selector]);

  const getLoginPayload = () => {
    const textEncoder = new TextEncoder();

    const message = textEncoder.encode(JSON.stringify(
      { timestampMs: Date.now() },
    ));

    let signature, publicKey;

    if (keyPair && accountId) {
      const signed = keyPair.sign(message);

      signature = signed.signature;
      publicKey = signed.publicKey;
    }

    return {
      accountId: accountId as string,
      seasonId: gameSeason as string,
      signedMessage: {
        message: message.toString(),
        signature: signature?.toString(),
        publicKey: publicKey?.toString(),
      },
    };
  };

  useEffect(() => {
    const newAccount =
      accounts.find((account) => account.active)?.accountId || '';

    setAccountId(newAccount);

    void (async () => {
      const keystore = new keyStores.BrowserLocalStorageKeyStore();

      const accountKeyPair = await keystore.getKey(
        network as string,
        newAccount,
      );

      setKeypair(accountKeyPair);
    })();
  }, [accounts]);

  if (!selector) {
    return null;
  }

  return (
    <WalletContext.Provider
      value={{
        selector,
        showModal,
        accountId,
        signOut,
        toggleModal,
        getLoginPayload,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export function useWalletSelector() {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error(
      'useWalletSelector must be used within a WalletSelectorContextProvider',
    );
  }

  return context;
}

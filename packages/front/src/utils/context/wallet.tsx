import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
} from 'react';
import { keyStores } from 'near-api-js';
import { KeyPair } from 'near-api-js/lib/utils';
import type { AccountView } from 'near-api-js/lib/providers/provider';
import { map, distinctUntilChanged } from 'rxjs';
import { setupWalletSelector } from '@near-wallet-selector/core';
import type { WalletSelector, AccountState } from '@near-wallet-selector/core';
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";

interface WalletContextValue {
  // accountKeyPair: any;
  selector: WalletSelector;
  accounts: AccountState[];
  accountId: string | null;
  showModal: boolean;
  signOut: () => Promise<void>;
  toggleModal: () => void;
  // signMessage: () => any;
}

export type Account = AccountView & {
  account_id: string;
};

const WalletContext =
  React.createContext<WalletContextValue | null>(null);

export const WalletSelectorContextProvider: React.FC<
  PropsWithChildren<Record<any, any>>
> = ({ children }) => {
  // const [accountKeyPair, setKeypair] = useState<any>();
  const [accountId, setAccountId] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [accounts, setAccounts] = useState<AccountState[]>([]);
  const [selector, setSelector] = useState<WalletSelector | null>(null);

  const toggleModal = () => setShowModal(!showModal);

  const signOut = async () => {
    if (!selector) {
      return;
    }

    const wallet = await selector.wallet();

    wallet.signOut();
  };

  const init = useCallback(async () => {
    const newSelector = await setupWalletSelector({
      network: import.meta.env.VITE_NEAR_NETWORK || 'testnet',
      debug: true,
      modules: [setupMyNearWallet()],
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

  // const signMessage = () => {
  //   const {
  //     signature,
  //     publicKey,
  //   } = accountKeyPair.sign(message);

  //   return {
  //     message,
  //     signature,
  //     publicKey: publicKey.toString(),
  //   };
  // };

  useEffect(() => {
    const newAccount =
      accounts.find((account) => account.active)?.accountId || "";

    setAccountId(newAccount);

    // (async () => {
    //   const keystore = new keyStores.BrowserLocalStorageKeyStore();

    //   const keyPair = await keystore.getKey(
    //     import.meta.env.VITE_NEAR_NETWORK,
    //     newAccount,
    //   );

    //   setKeypair(keyPair);
    // })();
  }, [accounts]);

  if (!selector) {
    return null;
  }

  return (
    <WalletContext.Provider
      value={{
        signOut,
        selector,
        accounts,
        accountId,
        showModal,
        toggleModal,
        // signMessage,
        // accountKeyPair,
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

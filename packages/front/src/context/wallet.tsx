import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
  useMemo,
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
  accountId: string | undefined;
  toggleModal: () => void;
  selector: WalletSelector;
  signOut: () => Promise<void>;
  isLoading: boolean;
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
  const [isLoadingInit, setIsLoadingInit] = useState(true);
  const [isLoadingAccountId, setIsLoadingAccountId] = useState(true);
  const [keyPair, setKeypair] = useState<KeyPair>();
  const [accountId, setAccountId] = useState<string | undefined>();
  const [accounts, setAccounts] = useState<AccountState[]>([]);
  const [selector, setSelector] = useState<WalletSelector | null>(null);

  const toggleModal = () => setShowModal(!showModal);

  const isLoading = useMemo(() => {
    return isLoadingInit || isLoadingAccountId;
  }, [isLoadingInit, isLoadingAccountId]);

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

    setIsLoadingInit(false);
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
      accounts.find((account) => account.active)?.accountId;

    setAccountId(newAccount);
    setIsLoadingAccountId(false);

    void (async () => {
      const keystore = new keyStores.BrowserLocalStorageKeyStore();

      const accountKeyPair = await keystore.getKey(
        network as string,
        newAccount as string,
      );

      setKeypair(accountKeyPair);
    })();
  }, [isLoadingInit]);

  if (!selector) {
    return null;
  }

  return (
    <WalletContext.Provider
      value={{
        selector,
        showModal,
        isLoading,
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

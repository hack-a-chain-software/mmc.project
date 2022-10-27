import "./index.css";
import React, { Suspense } from "react";
import { App } from "@/components";
import ReactDOM from "react-dom/client";
import { WalletSelectorContextProvider } from "@/utils/context/wallet";
import { WalletSelectorModal } from "@/components/modals/wallet";

import { RelayEnvironmentProvider } from "react-relay";
import { RelayEnvironment } from "./relay";

import { Fallback } from "@/components";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WalletSelectorContextProvider>
      <RelayEnvironmentProvider environment={RelayEnvironment}>
        <Suspense fallback={<Fallback />}>
          <App />
        </Suspense>
      </RelayEnvironmentProvider>

      <WalletSelectorModal />
    </WalletSelectorContextProvider>
  </React.StrictMode>
);

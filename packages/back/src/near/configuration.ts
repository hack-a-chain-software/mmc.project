export interface NearConnectionConfiguration {
  networkId: string;
  nodeUrl: string;
}

export interface NearConfiguration {
  connection: NearConnectionConfiguration;

  // the contract game
  gameContract: string;

  // Account used by this service to make contract function calls
  account: {
    id: string;
    keyPair: string;
  };
}

export interface NearConnectionConfiguration {
  networkId: string;
  nodeUrl: string;
}

export interface NearConfiguration {
  connection: NearConnectionConfiguration;

  // Smart contract account id, to be validated against access key
  cluesContract: string;

  // Account used by this service to make contract function calls
  account: {
    id: string;
    keyPair: string;
  };
}

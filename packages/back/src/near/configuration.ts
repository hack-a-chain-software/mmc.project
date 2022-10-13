export interface NearConnectionConfiguration {
  networkId: string;
  nodeUrl: string;
}

export interface NearConfiguration {
  // Smart contract account id, to be validated against access key
  receiverId: string;

  connection: NearConnectionConfiguration;
}

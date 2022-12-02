import { AuthConfiguration } from "src/auth/configuration";
import { NearConfiguration } from "src/near/configuration";
import { NftConfiguration } from "src/nft/configuration";
import { PostGraphileConfiguration } from "src/postgraphile/configuration";

export interface Configuration {
  auth: AuthConfiguration;
  near: NearConfiguration;
  nft: NftConfiguration;
  postgraphile: PostGraphileConfiguration;
}

export function configuration(): Configuration {
  return {
    auth: {
      messageValidForMs: parseInt(process.env.AUTH_MESSAGE_VALID_FOR_MS, 10),

      jwt: {
        secret: process.env.JWT_SECRET,
        validForS: parseInt(process.env.JWT_VALID_FOR_S, 10),
      },
    },

    near: {
      receiverId: process.env.RECEIVER_ID,

      account: {
        id: process.env.ACCOUNT_ID,
        keyPair: process.env.ACCOUNT_KEYPAR,
      },

      connection: {
        networkId: process.env.NEAR_NETWORK,
        nodeUrl: process.env.NEAR_NODE_URL,
      },
    },

    nft: {
      contractAccountId: process.env.NFT_CONTRACT_ID,
    },

    postgraphile: {
      databaseUrl: process.env.DATABASE_URL,
    },
  };
}

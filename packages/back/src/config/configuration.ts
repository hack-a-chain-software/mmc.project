import { AuthConfiguration } from 'src/auth/configuration';
import { NearConfiguration } from 'src/near/configuration';
import { GameConfiguration } from 'src/game/configuration';

export interface Configuration {
  auth: AuthConfiguration;
  near: NearConfiguration;
  game: GameConfiguration;
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
      cluesContract: process.env.CLUES_CONTRACT,

      account: {
        id: process.env.ACCOUNT_ID,
        keyPair: process.env.ACCOUNT_KEYPAR,
      },

      connection: {
        networkId: process.env.NEAR_NETWORK,
        nodeUrl: process.env.NEAR_NODE_URL,
      },
    },

    game: {
      contractAccountId: process.env.NFT_CONTRACT_ID,
    },
  };
}

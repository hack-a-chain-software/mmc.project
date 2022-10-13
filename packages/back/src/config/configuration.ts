import { AuthConfiguration } from 'src/auth/configuration';
import { NearConfiguration } from 'src/near/configuration';

export interface Configuration {
  near: NearConfiguration;
  auth: AuthConfiguration;
}

export function configuration(): Configuration {
  return {
    near: {
      receiverId: process.env.RECEIVER_ID,

      connection: {
        networkId: process.env.NEAR_NETWORK,
        nodeUrl: process.env.NEAR_NODE_URL,
      },
    },
    auth: {
      messageValidForMs: parseInt(process.env.AUTH_MESSAGE_VALID_FOR_MS, 10),

      jwt: {
        secret: process.env.JWT_SECRET,
        validForS: parseInt(process.env.JWT_VALID_FOR_S, 10),
      },
    },
  };
}

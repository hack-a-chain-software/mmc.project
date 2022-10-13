import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Near } from 'near-api-js';
import { PublicKey } from 'near-api-js/lib/utils';
import { Configuration } from 'src/config/configuration';

import { CONNECTION_PROVIDER_KEY } from './constants';

@Injectable()
export class NearService {
  @Inject(CONNECTION_PROVIDER_KEY)
  private connection: Near;

  private receiverId: string;

  constructor(configService: ConfigService<Configuration>) {
    const nearConfig = configService.get('near', { infer: true });

    this.receiverId = nearConfig.receiverId;
  }

  async validateAccessKey(
    accountId: string,
    publicKey: PublicKey,
  ): Promise<boolean> {
    const account = await this.connection.account(accountId);

    const accountKeys = await account.getAccessKeys();

    const mmcKey = accountKeys.find(
      (ak) => ak.public_key == publicKey.toString(),
    );
    if (!mmcKey) return false;

    const permission = mmcKey.access_key.permission;

    return (
      permission == 'FullAccess' ||
      permission.FunctionCall.receiver_id == this.receiverId
    );
  }
}

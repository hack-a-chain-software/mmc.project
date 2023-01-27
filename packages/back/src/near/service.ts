import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Account, Near } from 'near-api-js';
import {
  ChangeFunctionCallOptions,
  ViewFunctionCallOptions,
} from 'near-api-js/lib/account';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { PublicKey } from 'near-api-js/lib/utils';
import { Configuration } from 'src/config/configuration';

import { CONNECTION_PROVIDER_KEY } from './constants';

@Injectable()
export class NearService {
  private cluesContract: string;
  private guessContract: string;
  private account: Promise<Account>;

  constructor(
    @Inject(CONNECTION_PROVIDER_KEY)
    private connection: Near,
    configService: ConfigService<Configuration>,
  ) {
    const nearConfig = configService.get('near', { infer: true });

    this.cluesContract = nearConfig.cluesContract;
    this.guessContract = nearConfig.guessContract;
    this.account = this.connection.account(nearConfig.account.id);
  }

  async validateAccessKey(
    accountId: string,
    publicKey: PublicKey,
  ): Promise<boolean> {
    const account = await this.connection.account(accountId);

    const accountKeys = await account.getAccessKeys();

    const providedKey = accountKeys.find(
      (ak) => ak.public_key == publicKey.toString(),
    );
    if (!providedKey) return false;

    const permission = providedKey.access_key.permission;

    return (
      permission == 'FullAccess' ||
      permission.FunctionCall.receiver_id == this.cluesContract
    );
  }

  async callContractChangeFunction<T>(
    options: ChangeFunctionCallOptions,
  ): Promise<FinalExecutionOutcome> {
    const account = await this.account;
    const outcome = await account.functionCall(options);

    return outcome;
  }

  async callContractViewFunction<T>(
    options: ViewFunctionCallOptions,
  ): Promise<T> {
    const account = await this.account;
    const result: T = await account.viewFunctionV2(options);

    return result;
  }

  async getNftTokensForOwner(accountId: string): Promise<any> {
    try {
      const res = await this.callContractViewFunction({
        contractId: this.cluesContract,
        methodName: 'nft_tokens_for_owner',
        args: {
          account_id: accountId,
        },
      });

      // return res;
      return ['1'];
    } catch (e) {
      console.warn(e);

      return [];
    }
  }

  async discountTicket(args: { guessHash: string; accountId: string }) {
    return this.callContractChangeFunction({
      args,
      methodName: 'save_guess',
      contractId: this.guessContract,
    });
  }
}

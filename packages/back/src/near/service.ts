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
import * as BN from 'bn.js';

const OneYOctoNear = '1000000000000000000000000';

export type Token = {
  token_id: string;
  owner_id: string;
  metadata: TokenMetadata;
};

export type TokenMetadata = {
  title: string | null;
  description: string | null;
  media: string | null;
  media_hash: string | null;
  copies: number | null;
  issued_at: number | null;
  expires_at: number | null;
  starts_at: number | null;
  updated_at: number | null;
  extra: string | null;
  reference: string | null;
  reference_hash: string | null;
};


@Injectable()
export class NearService {
  private gameContract: string;
  private account: Promise<Account>;

  constructor(
    @Inject(CONNECTION_PROVIDER_KEY)
    private connection: Near,
    configService: ConfigService<Configuration>,
  ) {
    const nearConfig = configService.get('near', { infer: true });

    this.gameContract = nearConfig.gameContract;
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
      permission.FunctionCall.receiver_id == this.gameContract
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

  async getNftTokensForOwner(
    accountId: string = this.gameContract,
  ): Promise<Token[]> {
    try {
      const res = await this.callContractViewFunction<Token[]>({
        contractId: this.gameContract,
        methodName: 'nft_tokens_for_owner',
        args: {
          account_id: accountId,
        },
      });

      return res;
    } catch (e) {
      console.warn(e);

      return [];
    }
  }

  async getStakedClues(): Promise<any> {
    try {
      const res = await this.callContractViewFunction({
        contractId: this.gameContract,
        methodName: 'view_staked_clues',
        args: {},
      });

      return res;
    } catch (e) {
      console.warn(e);

      return [];
    }
  }

  async discountTicket(args: { guess_hash: string; account_id: string }) {
    return this.callContractChangeFunction({
      args,
      methodName: 'save_guess',
      contractId: this.gameContract,
      attachedDeposit: new BN('1'),
    });
  }
}

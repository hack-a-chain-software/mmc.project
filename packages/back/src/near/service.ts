import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Account, Near } from 'near-api-js';
import { ChangeFunctionCallOptions, ViewFunctionCallOptions } from 'near-api-js/lib/account';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { PublicKey } from 'near-api-js/lib/utils';
import { Configuration } from 'src/config/configuration';

import { CONNECTION_PROVIDER_KEY } from './constants';

@Injectable()
export class NearService {
    private receiverId: string;
    private account: Promise<Account>;

    constructor(
        @Inject(CONNECTION_PROVIDER_KEY)
        private connection: Near,
        configService: ConfigService<Configuration>,
    ) {
        const nearConfig = configService.get('near', { infer: true });

        this.receiverId = nearConfig.receiverId;
        this.account = this.connection.account(nearConfig.account.id);
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

    async callContractChangeFunction<T>(options: ChangeFunctionCallOptions): Promise<FinalExecutionOutcome> {
        const outcome = await (await this.account).functionCall(options);

        return outcome;
    }

    async callContractViewFunction<T>(options: ViewFunctionCallOptions): Promise<T> {
        const result: T = await (await this.account).viewFunctionV2(options);

        return result;
    }
}

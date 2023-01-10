import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Configuration } from "src/config/configuration";
import { NearService } from "src/near/service";

// TODO: move it somewhere else
interface Nep171Token {
    token_id: string,
    owner_id: string,
}

@Injectable()
export class NftService {
    private contractId: string;

    constructor(
        private nearService: NearService,
        configService: ConfigService<Configuration>
    ) {
        const nearConfig = configService.get('near', { infer: true });

        this.contractId = nearConfig.receiverId;
    }

    async getNft(tokenId: string): Promise<Nep171Token> {
        return await this.nearService.callContractViewFunction<Nep171Token>({
            contractId: this.contractId,
            methodName: 'nft_token',
            args: {
                'token_id': tokenId
            }
        });
    }
}

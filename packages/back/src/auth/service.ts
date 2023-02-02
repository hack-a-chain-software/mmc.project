import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PublicKey } from 'near-api-js/lib/utils';
import { CodecService } from 'src/codec/service';
import { Configuration } from 'src/config/configuration';
import { NearService } from 'src/near/service';

// TODO: move it somewhere else
export interface SignedMessage {
  message: Uint8Array | undefined;
  signature: Uint8Array | undefined;
  publicKey: PublicKey | undefined;
}

// TODO: move it somewhere else
export interface AuthMessage {
  timestampMs: number;
}

@Injectable()
export class AuthService {
  private messageValidForMs: number;

  constructor(
    private nearService: NearService,
    private jwtService: JwtService,
    private codecService: CodecService,
    configService: ConfigService<Configuration>,
  ) {
    const authConfig = configService.get('auth', { infer: true });

    this.messageValidForMs = authConfig.messageValidForMs;
  }

  async authenticate(
    accountId: string,
    seasonId: string,
    signedMessage: SignedMessage,
  ): Promise<
    { success: true | false; jwt: string } | { success: false; error: string }
  > {
    let success = true;
    const clues: string[] = [];
    try {
      const isKeyValid = await this.nearService.validateAccessKey(
        accountId,
        signedMessage.publicKey,
      );

      if (!isKeyValid) {
        success = false;
        console.log('Invalid permission for key');
      }
    } catch (e) {
      success = false;
    }

    try {
      const decodedMessage = this.codecService.decode(signedMessage.message);

      const isMessageValid = this.validateMessage(decodedMessage);

      if (!isMessageValid) {
        success = false;
        console.log('Malformed or expired message');
      }
    } catch (e) {
      success = false;
    }

    try {
      const isSignatureValid = this.verifySignature(signedMessage);

      if (!isSignatureValid) {
        success = false;
        console.log('Invalid signature');
      }
    } catch (e) {
      success = false;
    }

    if (success) {
      const res = await this.nearService.getNftTokensForOwner(accountId);

      clues.push(...res.map(({ token_id }) => token_id));
    }

    console.log(
      'validated account',
      JSON.stringify({
        accountId: success ? accountId : '',
        seasonId,
        clues,
      }),
    );

    return {
      success: true,
      jwt: await this.jwtService.signAsync({
        sub: { accountId: success ? accountId : '', seasonId, clues },
      }),
    };
  }

  validateMessage(message: string): boolean {
    const parsedMessage: AuthMessage = JSON.parse(message);
    if (typeof parsedMessage.timestampMs != 'number') {
      return false;
    }

    const currentTimestampMs = new Date().valueOf();
    const deltaT = currentTimestampMs - parsedMessage.timestampMs;
    const hasntExpired = 0 <= deltaT && deltaT <= this.messageValidForMs;

    return hasntExpired;
  }

  verifySignature(signedMessage: SignedMessage): boolean {
    return signedMessage.publicKey.verify(
      signedMessage.message,
      signedMessage.signature,
    );
  }
}

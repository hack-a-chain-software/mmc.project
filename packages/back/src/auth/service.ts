import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PublicKey } from 'near-api-js/lib/utils';
import { CodecService } from 'src/codec/service';
import { Configuration } from 'src/config/configuration';
import { NearService } from 'src/near/service';

// TODO: move it somewhere else
export interface SignedMessage {
  message: Uint8Array;
  signature: Uint8Array;
  publicKey: PublicKey;
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
    signedMessage: SignedMessage,
  ): Promise<
    { success: true; jwt: string } | { success: false; error: string }
  > {
    const isKeyValid = await this.nearService.validateAccessKey(
      accountId,
      signedMessage.publicKey,
    );
    if (!isKeyValid) {
      return { success: false, error: 'Invalid permission for key' };
    }

    const decodedMessage = this.codecService.decode(signedMessage.message);
    const isMessageValid = this.validateMessage(decodedMessage);
    if (!isMessageValid) {
      return { success: false, error: 'Malformed or expired message' };
    }

    const isSignatureValid = this.verifySignature(signedMessage);
    if (!isSignatureValid) {
      return { success: false, error: 'Invalid signature' };
    }

    return {
      success: true,
      jwt: await this.jwtService.signAsync({ sub: accountId }),
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

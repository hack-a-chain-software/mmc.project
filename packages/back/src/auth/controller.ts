import { Body, Controller, Post, Response } from '@nestjs/common';
import * as express from 'express';
import { PublicKey } from 'near-api-js/lib/utils';
import { AUTH_URI } from './constants';
import { AuthService, SignedMessage } from './service';

interface SignedMessageDto {
  message: number[];
  signature: number[];
  publicKey: string;
}

interface LoginDto {
  accountId: string;
  signedMessage: SignedMessageDto;
}

@Controller(AUTH_URI)
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  async login(@Body() body: LoginDto, @Response() res: express.Response) {
    let signedMessage: SignedMessage;
    try {
      signedMessage = {
        message: Uint8Array.from(body.signedMessage.message),
        signature: Uint8Array.from(body.signedMessage.signature),
        publicKey: PublicKey.fromString(body.signedMessage.publicKey),
      };
    } catch (error) {
      return res.status(400).json({ success: false, error: error.toString() });
    }

    const authResult = await this.authService.authenticate(
      body.accountId,
      signedMessage,
    );

    return res.status(authResult.success ? 200 : 401).json(authResult);
  }
}

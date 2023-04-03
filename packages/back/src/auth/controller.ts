import { Body, Controller, Post, Response } from '@nestjs/common';
import * as express from 'express';
import { PublicKey } from 'near-api-js/lib/utils';
import { AUTH_URI } from './constants';
import { AuthService, SignedMessage } from './service';

interface SignedMessageDto {
  signature: string;
  publicKey: string;
  message: string;
}

interface LoginDto {
  seasonId: string;
  accountId: string;
  signedMessage: SignedMessageDto;
}

@Controller(AUTH_URI)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto, @Response() res: express.Response) {
    let signedMessage: SignedMessage;

    try {
      signedMessage = {
        message: this.getUint8Array(body.signedMessage.message),
        signature: this.getUint8Array(body.signedMessage.signature),
        publicKey: this.getPublicKey(body.signedMessage.publicKey),
      };
    } catch (error) {
      return res.status(400).json({ success: false, error: error.toString() });
    }

    const authResult = await this.authService.authenticate(
      body.accountId,
      body.seasonId,
      signedMessage,
    );

    return res.status(authResult.success ? 200 : 401).json(authResult);
  }

  @Post('admin')
  async loginAdmin(
    @Body() body: { password: string },
    @Response() res: express.Response,
  ) {
    if (body.password !== this.authService.adminPassword) {
      return res.status(400).json({ success: false, error: 'Wrong Password' });
    }

    const jwt = await this.authService.adminPrivileges();

    return res.status(400).json(jwt);
  }

  getUint8Array(value?: string) {
    if (!value) {
      return;
    }

    const valuesOfUint8Array = value.split(',').map((value) => Number(value));

    return Uint8Array.from(valuesOfUint8Array);
  }

  getPublicKey(value?: string) {
    if (!value) {
      return;
    }

    return PublicKey.fromString(value);
  }
}

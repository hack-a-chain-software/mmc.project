import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { KeyPair } from 'near-api-js';
import { configServicePartialMock } from 'src/config/mock.test';
import { NearService } from 'src/near/service';
import { AuthConfiguration } from './configuration';
import { AuthService } from './service';

describe('AuthService', () => {
  let module: TestingModule;
  let authService: DeepMocked<AuthService>;

  const keyPair = KeyPair.fromRandom('ed25519');
  const authConfig: Partial<AuthConfiguration> = {
    jwt: { secret: 'abc', validForS: 2 },
    messageValidForMs: 60000,
  };

  beforeEach(async () => {
    jest.restoreAllMocks();

    module = await Test.createTestingModule({
      providers: [AuthService, configServicePartialMock('auth', authConfig)],
    })
      .useMocker(createMock)
      .compile();

    authService = module.get(AuthService);
  });

  describe('authenticate', () => {
    it('returned JWT subject should be the signer account id', async () => {
      // Arrange
      const accountId = 'signer.near';
      const seasonId = 'abcdef';

      const nearServiceMock: DeepMocked<NearService> = module.get(NearService);
      nearServiceMock.validateAccessKey.mockResolvedValueOnce(true);

      jest.spyOn(authService, 'validateMessage').mockReturnValueOnce(true);
      jest.spyOn(authService, 'verifySignature').mockReturnValueOnce(true);

      // Act
      const authResult = await authService.authenticate(accountId, seasonId, {
        message: new Uint8Array(),
        signature: new Uint8Array(),
        publicKey: keyPair.getPublicKey(),
      });

      // Assert
      expect(authResult.success).toBe(true);

      const jwtServiceMock: DeepMocked<JwtService> = module.get(JwtService);
      expect(jwtServiceMock.signAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          sub: { accountId: 'signer.near', clues: [], seasonId: 'abcdef' },
        }),
      );
    });
  });

  describe('validateMessage', () => {
    it('should return true for valid messages', () => {
      const message = JSON.stringify({ timestampMs: new Date().valueOf() });

      const isMessageValid = authService.validateMessage(message);

      expect(isMessageValid).toBe(true);
    });

    it('should return false for expired messages', () => {
      const message = JSON.stringify({
        timestampMs: new Date().valueOf() - 120000,
      });

      const isMessageValid = authService.validateMessage(message);

      expect(isMessageValid).toBe(false);
    });

    it('should return false for malformed messages', () => {
      const message = JSON.stringify({ whatever: '' });

      const isMessageValid = authService.validateMessage(message);

      expect(isMessageValid).toBe(false);
    });

    it('should return false for messages with future timestamps', () => {
      const message = JSON.stringify({
        timestampMs: new Date().valueOf() + 180000,
      });

      const isMessageValid = authService.validateMessage(message);

      expect(isMessageValid).toBe(false);
    });
  });

  describe('verifySignature', () => {
    it('should return true for valid signatures', () => {
      const message = new TextEncoder().encode('a');
      const signature = keyPair.sign(message);
      const signedMessage = { message, ...signature };

      expect(authService.verifySignature(signedMessage)).toBe(true);
    });

    it('should return false for invalid signatures', () => {
      const encoder = new TextEncoder();
      const message = encoder.encode('a');
      const signature = keyPair.sign(message);
      const signedMessage = { message: encoder.encode('b'), ...signature };

      expect(authService.verifySignature(signedMessage)).toBe(false);
    });
  });
});

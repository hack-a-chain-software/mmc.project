import { getMockRes } from '@jest-mock/express';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { KeyPair } from 'near-api-js/lib/utils';
import { configServicePartialMock } from 'src/config/mock.test';
import { AuthConfiguration } from './configuration';
import { AuthController } from './controller';
import { AuthService } from './service';

describe('AuthControler', () => {
  let module: TestingModule;
  let authController: AuthController;

  const { res: resMock, clearMockRes } = getMockRes();
  const authConfig: Partial<AuthConfiguration> = { jwt: { secret: 'abc', validForS: 2 }, messageValidForMs: 60000 }

  beforeEach(async () => {
    jest.restoreAllMocks();

    module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [configServicePartialMock('auth', authConfig)]
    })
      .useMocker(createMock)
      .compile();

    authController = module.get(AuthController);

    clearMockRes();
  });

  describe('login', () => {
    it('should return 200 with JWT when authenticate result is successful', async () => {
      // Arrange
      const authServiceMock: DeepMocked<AuthService> = module.get(AuthService);
      authServiceMock.authenticate.mockResolvedValueOnce({
        success: true,
        jwt: 'whatever',
      });

      const loginDto = {
        accountId: 'account.near',
        signedMessage: {
          message: [],
          signature: [],
          publicKey: KeyPair.fromRandom('ed25519').getPublicKey().toString(),
        },
      };

      // Act
      await authController.login(loginDto, resMock);

      // Assert
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          jwt: expect.stringContaining(''),
        }),
      );
    });

    it('should return 401 with error when authenticate result is unsuccessful', async () => {
      // Arrange
      const authServiceMock: DeepMocked<AuthService> = module.get(AuthService);
      authServiceMock.authenticate.mockResolvedValueOnce({
        success: false,
        error: 'you suck',
      });

      const loginDto = {
        accountId: 'account.near',
        signedMessage: {
          message: [],
          signature: [],
          publicKey: KeyPair.fromRandom('ed25519').getPublicKey().toString(),
        },
      };

      // Act
      await authController.login(loginDto, resMock);

      // Assert
      expect(resMock.status).toHaveBeenCalledWith(401);
      expect(resMock.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.stringContaining(''),
        }),
      );
    });

    it('should return 400 with error when public key is malformed', async () => {
      // Arrange
      const loginDto = {
        accountId: 'account.near',
        signedMessage: {
          message: [],
          signature: [],
          publicKey: 'not a correctly encoded public key',
        },
      };

      // Act
      await authController.login(loginDto, resMock);

      // Assert
      expect(resMock.status).toHaveBeenCalledWith(400);
      expect(resMock.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.stringContaining(''),
        }),
      );
    });
  });
});

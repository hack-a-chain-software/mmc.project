import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CodecModule } from 'src/codec/module';
import { Configuration } from 'src/config/configuration';
import { NearModule } from 'src/near/module';
import { AuthController } from './controller';
import { JwtStrategy } from './jwt/strategy';
import { AuthService } from './service';

@Module({
  imports: [
    ConfigModule,
    NearModule,
    CodecModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory(configService: ConfigService<Configuration>) {
        const jwtConfig = configService.get('auth.jwt', { infer: true });

        return {
          secret: jwtConfig.secret,
          signOptions: {
            expiresIn: `${jwtConfig.validForS}s`,
          },
        };
      },
      imports: [ConfigModule],
      inject: [ConfigService]
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule { }

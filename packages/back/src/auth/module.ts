import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CodecModule } from 'src/codec/module';
import { Configuration } from 'src/config/configuration';
import { AuthController } from './controller';
import { JwtStrategy } from './jwt/strategy';
import { AuthService } from './service';

@Module({
  imports: [
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
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}

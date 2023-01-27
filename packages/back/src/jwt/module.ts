import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule as JwtBaseModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Configuration } from 'src/config/configuration';
import { JwtAuthGuard } from './auth.guard';
import { JwtStrategy } from './strategy';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtBaseModule.registerAsync({
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
      inject: [ConfigService],
    }),
  ],
  providers: [JwtStrategy, JwtAuthGuard],
  exports: [JwtBaseModule, JwtStrategy, JwtAuthGuard],
})
export class JwtModule {}

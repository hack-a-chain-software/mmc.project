import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CodecModule } from 'src/codec/module';
import { NearModule } from 'src/near/module';
import { AuthController } from './controller';
import { JwtModule } from '../jwt/module';
import { AuthService } from './service';

@Module({
  imports: [
    ConfigModule,
    NearModule,
    CodecModule,
    JwtModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule { }

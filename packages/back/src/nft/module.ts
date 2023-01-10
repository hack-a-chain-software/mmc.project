import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from 'src/jwt/module';
import { NearModule } from 'src/near/module';
import { NftController } from './controller';
import { NftService } from './service';

@Module({
    imports: [
        ConfigModule,
        NearModule,
        JwtModule
    ],
    controllers: [NftController],
    providers: [NftService],
    exports: [NftService],
})
export class NftModule { }

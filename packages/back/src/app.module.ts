import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/module";
import { configuration } from "./config/configuration";
import { NftModule } from "./nft/module";
import { PostGraphileModule } from "./postgraphile/module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    AuthModule,
    NftModule,
    PostGraphileModule,
  ],
})
export class AppModule {}

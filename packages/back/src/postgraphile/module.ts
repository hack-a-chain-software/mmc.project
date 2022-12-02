import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PostGraphileController } from "./controller";
import { middlewareProvider } from "./middleware.provider";

@Module({
  imports: [ConfigModule],
  controllers: [PostGraphileController],
  providers: [middlewareProvider],
})
export class PostGraphileModule {}

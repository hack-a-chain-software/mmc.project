import PgSimplifyInflectorPlugin from "@graphile-contrib/pg-simplify-inflector";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PostGraphileModule } from "postgraphile-nest";
import { AuthModule } from "./auth/module";
import { Configuration, configuration } from "./config/configuration";
import { NftModule } from "./nft/module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    AuthModule,
    NftModule,
    // NOTE: async is not required, but sync `forRoot` doesn't allow for dependency-injection
    PostGraphileModule.forRootAsync({
      useFactory(configService: ConfigService<Configuration>) {
        const postgraphileConfig = configService.get("postgraphile", {
          infer: true,
        });

        return {
          playground: true,
          playgroundRoute: "playground",

          pgConfig: {
            connectionString: postgraphileConfig.databaseUrl,
          },
          appendPlugins: [PgSimplifyInflectorPlugin],

          // DEV CONFIGS
          showErrorStack: true,
          extendedErrors: ["hint", "detail", "errcode"],
          graphiql: true,
          enhanceGraphiql: true,
          exportGqlSchemaPath: "schema.graphql",
        };
      },
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
  ],
})
export class AppModule {}

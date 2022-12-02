import PgSimplifyInflectorPlugin from "@graphile-contrib/pg-simplify-inflector";
import { IncomingMessage, ServerResponse } from "http";
import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpRequestHandler, postgraphile } from "postgraphile";
import { Configuration } from "src/config/configuration";
import { MIDDLEWARE_PROVIDER_KEY } from "./constants";

export type PostgraphileMiddleware = HttpRequestHandler<
  IncomingMessage,
  ServerResponse<IncomingMessage>
>;

export const middlewareProvider: Provider = {
  provide: MIDDLEWARE_PROVIDER_KEY,
  useFactory: async (
    configService: ConfigService<Configuration>
  ): Promise<PostgraphileMiddleware> => {
    const postgraphileConfig = configService.get("postgraphile", {
      infer: true,
    });

    return postgraphile(postgraphileConfig.databaseUrl, "public", {
      appendPlugins: [PgSimplifyInflectorPlugin],

      // DEV CONFIGS
      graphiql: true,
      enhanceGraphiql: true,
      extendedErrors: ["hint", "detail", "errcode"],
    });
  },
  inject: [ConfigService],
};

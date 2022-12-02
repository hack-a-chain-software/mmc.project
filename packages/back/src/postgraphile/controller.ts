import { Controller, Get, Post, Req, Next, Res, Inject } from "@nestjs/common";
import { Request, Response } from "express";
import { PostGraphileResponseNode } from "postgraphile";
import { MIDDLEWARE_PROVIDER_KEY, POSTGRAPHILE_URI } from "./constants";
import { PostgraphileMiddleware } from "./middleware.provider";

@Controller(POSTGRAPHILE_URI)
export class PostGraphileController {
  constructor(
    @Inject(MIDDLEWARE_PROVIDER_KEY)
    private middleware: PostgraphileMiddleware
  ) {}

  @Get("graphiql")
  graphiql(@Req() request: Request, @Res() response: Response, @Next() next) {
    this.middleware.graphiqlRouteHandler(
      new PostGraphileResponseNode(request, response, next)
    );
  }

  @Post("graphql")
  graphql(@Req() request: Request, @Res() response: Response, @Next() next) {
    this.middleware.graphqlRouteHandler(
      new PostGraphileResponseNode(request, response, next)
    );
  }
}

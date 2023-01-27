export interface JwtPayload {
  sub: {
    seasonId: string;
    accountId: string;
    clues: string[] | [];
  };
}

export interface JwtValidatedUser {
  accountId: string;
  seasonId: string;
  clues: string[] | [];
}

export interface JwtValidatedRequest extends Request {
  user: JwtValidatedUser;
}

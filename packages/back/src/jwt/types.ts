export interface JwtPayload {
  sub: {
    isAdmin: boolean;
    seasonId: string;
    accountId: string;
    clues: string[] | [];
  };
}

export interface JwtValidatedUser {
  isAdmin: boolean;
  accountId: string;
  seasonId: string;
  clues: string[] | [];
}

export interface JwtValidatedRequest extends Request {
  user: JwtValidatedUser;
}

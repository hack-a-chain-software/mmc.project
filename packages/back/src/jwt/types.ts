export interface JwtPayload {
  sub: string;
}

export interface JwtValidatedUser {
  accountId: string
}

export interface JwtValidatedRequest extends Request {
  user: JwtValidatedUser
}

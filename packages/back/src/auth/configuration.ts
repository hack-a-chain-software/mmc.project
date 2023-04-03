import { JwtConfiguration } from 'src/jwt/configuration';

export interface AuthConfiguration {
  // Time in miliseconds before a signed auth message is considered to be expired
  messageValidForMs: number;
  adminPassword: string;
  jwt: JwtConfiguration;
}

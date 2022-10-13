import { JwtConfiguration } from './jwt/configuration';

export interface AuthConfiguration {
  // Time in miliseconds before a signed auth message is considered to be expired
  messageValidForMs: number;

  jwt: JwtConfiguration;
}

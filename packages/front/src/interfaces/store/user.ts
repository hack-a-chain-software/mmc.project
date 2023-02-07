import { AxiosRequestConfig } from 'axios';

export interface UserStoreInterface {
  jwt: string | null;
  autenticated: boolean;
  accountId: string | null;
  toggleAutenticated: () => void,
  validateUser: () => Promise<string>;
  getRequestConfig: () => AxiosRequestConfig;
}

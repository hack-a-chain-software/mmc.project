import { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface UserStoreInterface {
  jwt: string | null;
  autenticated: boolean;
  accountId: string | null;
  toggleAutenticated: () => void,
  validateUser: () => Promise<string>;
  getRequestConfig: () => AxiosRequestConfig;
  sendRequest: (
    url: string,
    method: string,
    data?: any,
  ) => Promise<AxiosResponse<any, any>>;
}

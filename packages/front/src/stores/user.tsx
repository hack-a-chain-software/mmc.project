import { create } from 'zustand';
import api from '@/services/api';
import { useWallet } from './wallet';
import { UserStoreInterface } from '@/interfaces';

export const useUser = create<UserStoreInterface>((set, get) => ({
  jwt: null,
  accountId: null,
  autenticated: false,

	validateUser: async () => {
    const {
      accountId,
      getLoginPayload,
    } = useWallet.getState();

    const loginPayload = await getLoginPayload();

    const {
      sendRequest,
    } = get();

		const { data } = await sendRequest('/auth/login', 'post', {
			...loginPayload,
		});

		set({
			jwt: data.jwt,
      autenticated: !!accountId,
      accountId: accountId || '',
		});

		return data.jwt;
	},

  toggleAutenticated: () => {
    const {
      autenticated,
    } = get();

    set(() => ({ autenticated: !autenticated }));
  },

  getRequestConfig: () => {
    const {
      jwt,
    } = get();

    return {
      headers: { Authorization: `Bearer ${jwt as string}` },
    };
  },

  sendRequest: (url, method, data) => {
    const {
      getRequestConfig,
    } = get();

    return api({
      url,
      data,
      method,
      ...getRequestConfig(),
    });
  },
}));

import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect, Near } from 'near-api-js';
import { Configuration } from 'src/config/configuration';
import { CONNECTION_PROVIDER_KEY } from './constants';

export const connectionProvider: Provider = {
  provide: CONNECTION_PROVIDER_KEY,
  useFactory: async (
    configService: ConfigService<Configuration>,
  ): Promise<Near> => {
    return await connect(configService.get('near.connection', { infer: true }));
  },
  inject: [],
};

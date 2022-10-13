import { Provider } from '@nestjs/common';
import { ENCODER_PROVIDER_KEY } from './constants';

export const encoderProvider: Provider = {
  provide: ENCODER_PROVIDER_KEY,
  useValue: new TextEncoder(),
};

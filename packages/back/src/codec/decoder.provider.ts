import { Provider } from '@nestjs/common';
import { DECODER_PROVIDER_KEY } from './constants';

export const decoderProvider: Provider = {
  provide: DECODER_PROVIDER_KEY,
  useValue: new TextDecoder(),
};

import { Inject, Injectable } from '@nestjs/common';
import { ENCODER_PROVIDER_KEY, DECODER_PROVIDER_KEY } from './constants';

@Injectable()
export class CodecService {
  @Inject(ENCODER_PROVIDER_KEY)
  private encoder: TextEncoder;

  @Inject(DECODER_PROVIDER_KEY)
  private decoder: TextDecoder;

  encode(text: string): Uint8Array {
    return this.encoder.encode(text);
  }

  decode(bytes: Uint8Array): string {
    return this.decoder.decode(bytes);
  }
}

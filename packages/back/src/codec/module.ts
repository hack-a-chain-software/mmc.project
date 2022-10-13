import { Module } from '@nestjs/common';
import { CodecService } from './service';
import { encoderProvider } from './encoder.provider';
import { decoderProvider } from './decoder.provider';

@Module({
  imports: [],
  controllers: [],
  providers: [CodecService, encoderProvider, decoderProvider],
  exports: [CodecService],
})
export class CodecModule {}
